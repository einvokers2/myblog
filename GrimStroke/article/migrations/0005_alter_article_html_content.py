# Generated by Django 4.2.4 on 2023-09-04 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0004_article_html_content_article_is_html'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='html_content',
            field=models.TextField(verbose_name='html_content'),
        ),
    ]
