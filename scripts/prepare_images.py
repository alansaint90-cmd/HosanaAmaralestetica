"""Opcional: converte fotos de uma pasta em variantes WebP.
Uso: python scripts/prepare_images.py caminho/para/fotos
Nomes esperados: equipe.jpg, atendimento.jpg, hosana.jpg, premios.jpg.
As variantes prontas em dist/assets fazem parte do repositório.
"""
import argparse
from pathlib import Path
from PIL import Image, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Pasta contendo as fotos originais')
args = parser.parse_args()
output = Path(__file__).resolve().parent.parent / 'dist' / 'assets'
output.mkdir(parents=True, exist_ok=True)
for name in ('equipe', 'atendimento', 'hosana', 'premios'):
    source = args.source / f'{name}.jpg'
    if not source.is_file():
        print(f'Ignorado: {source.name} não encontrado')
        continue
    im = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    for width in (640, 1280):
        out = im.copy()
        out.thumbnail((width, 1800))
        out.save(output / f'{name}-{width}.webp', 'WEBP', quality=86, method=6)
