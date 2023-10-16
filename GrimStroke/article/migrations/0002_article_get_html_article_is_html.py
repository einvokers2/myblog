# Generated by Django 4.2.4 on 2023-09-04 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='get_html',
            field=models.TextField(default=None, verbose_name='HTML'),
        ),
        migrations.AddField(
            model_name='article',
            name='is_html',
            field=models.BooleanField(default=False),
        ),
    ]