# Generated by Django 2.2.5 on 2020-02-17 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_interface', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TempModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.AlterField(
            model_name='connector',
            name='mqtt_topic_available_datapoints',
            field=models.TextField(default=None, editable=False, unique=True, verbose_name='MQTT topic for available datapoints'),
        ),
        migrations.AlterField(
            model_name='connector',
            name='mqtt_topic_datapoint_map',
            field=models.TextField(default=None, editable=False, unique=True, verbose_name='MQTT topic for datapoint map'),
        ),
        migrations.AlterField(
            model_name='connector',
            name='mqtt_topic_datapoint_message_wildcard',
            field=models.TextField(default=None, editable=False, unique=True, verbose_name='MQTT topic for all datapoint messages (wildcard)'),
        ),
        migrations.AlterField(
            model_name='connector',
            name='mqtt_topic_heartbeat',
            field=models.TextField(default=None, editable=False, unique=True, verbose_name='MQTT topic for heartbeat'),
        ),
        migrations.AlterField(
            model_name='connector',
            name='mqtt_topic_logs',
            field=models.TextField(default=None, editable=False, unique=True, verbose_name='MQTT topic for logs'),
        ),
        migrations.AlterField(
            model_name='connector',
            name='mqtt_topic_raw_message_reprocess',
            field=models.TextField(default=None, editable=False, unique=True, verbose_name='MQTT topic for reprocess'),
        ),
        migrations.AlterField(
            model_name='connector',
            name='mqtt_topic_raw_message_to_db',
            field=models.TextField(default=None, editable=False, unique=True, verbose_name='MQTT topic for raw message to database'),
        ),
    ]
