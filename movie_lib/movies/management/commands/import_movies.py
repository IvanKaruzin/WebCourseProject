import csv
import re

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from movies.models import Genre, Movie, Person

DEFAULT_CSV = settings.BASE_DIR.parent / 'imdb_top_1000' / 'imdb_top_1000.csv'

YEAR_FIXES = {
    'Apollo 13': 1995,
}


def parse_int(value):
    if value is None:
        return None
    cleaned = re.sub(r'[^\d-]', '', value)
    return int(cleaned) if cleaned else None


def parse_year(title, value):
    if value and value.strip().isdigit():
        return int(value.strip())
    return YEAR_FIXES.get(title)


def parse_float(value):
    value = (value or '').strip()
    try:
        return float(value)
    except ValueError:
        return None


class Command(BaseCommand):
    help = 'Import movies from the IMDb Top 1000 CSV dataset.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--path',
            default=DEFAULT_CSV,
            help='Path to the CSV file (relative to project root or absolute).',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        path = options['path']
        try:
            csv_file = open(path, encoding='utf-8')
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f'CSV file not found: {path}'))
            return

        created, updated, skipped = 0, 0, 0
        genre_cache, person_cache = {}, {}

        def get_genre(name):
            name = name.strip()
            if name not in genre_cache:
                genre_cache[name], _ = Genre.objects.get_or_create(name=name)
            return genre_cache[name]

        def get_person(name):
            name = name.strip()
            if name not in person_cache:
                person_cache[name], _ = Person.objects.get_or_create(name=name)
            return person_cache[name]

        with csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                title = row['Series_Title'].strip()
                year = parse_year(title, row['Released_Year'])

                movie, was_created = Movie.objects.get_or_create(
                    title=title,
                    year=year,
                    defaults={
                        'certificate': (row.get('Certificate') or '').strip(),
                        'runtime': parse_int(row.get('Runtime')),
                        'overview': (row.get('Overview') or '').strip(),
                        'imdb_rating': parse_float(row.get('IMDB_Rating')),
                        'meta_score': parse_int(row.get('Meta_score')),
                        'votes': parse_int(row.get('No_of_Votes')),
                        'gross': parse_int(row.get('Gross')),
                        'poster_url': (row.get('Poster_Link') or '').strip(),
                    },
                )

                if not was_created:
                    skipped += 1
                    continue

                director = row.get('Director', '').strip()
                if director:
                    movie.directors.add(get_person(director))

                actors = [row.get(f'Star{i}', '').strip() for i in range(1, 5)]
                movie.actors.add(*[get_person(a) for a in actors if a])

                genres = [g.strip() for g in row.get('Genre', '').split(',') if g.strip()]
                movie.genres.add(*[get_genre(g) for g in genres])

                created += 1

        self.stdout.write(self.style.SUCCESS(
            f'Import finished. Movies created: {created}, skipped (already present): {skipped}.'
        ))
        self.stdout.write(
            f'Genres: {Genre.objects.count()}, Persons: {Person.objects.count()}, '
            f'Movies total: {Movie.objects.count()}.'
        )
