# Generated by Django 4.0.1 on 2022-02-25 01:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_topic_remove_room_created_at_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='topic',
            old_name='titile',
            new_name='title',
        ),
    ]
