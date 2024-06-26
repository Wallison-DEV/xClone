# Generated by Django 5.0.4 on 2024-05-15 02:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tweets", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="retweetmodel",
            name="tweet",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="retweets",
                to="tweets.postmodel",
            ),
        ),
    ]
