# Generated by Django 3.1.5 on 2021-09-04 22:42

from django.db import migrations
import timescale.db.models.fields


class Migration(migrations.Migration):

    dependencies = [("api_main", "0001_initial")]

    operations = [
        migrations.AlterField(
            model_name="datapointschedule",
            name="time",
            field=timescale.db.models.fields.TimescaleDateTimeField(
                default=None,
                help_text="For sensor datapoints: The time the value was received by the connector.\nFor actuator datapoints: The time the message was created by the external entity.\nBoth in milliseconds since 1970-01-01 UTC.",
                interval="1 day",
            ),
        ),
        migrations.AlterField(
            model_name="datapointsetpoint",
            name="time",
            field=timescale.db.models.fields.TimescaleDateTimeField(
                default=None,
                help_text="For sensor datapoints: The time the value was received by the connector.\nFor actuator datapoints: The time the message was created by the external entity.\nBoth in milliseconds since 1970-01-01 UTC.",
                interval="1 day",
            ),
        ),
        migrations.AlterField(
            model_name="datapointvalue",
            name="time",
            field=timescale.db.models.fields.TimescaleDateTimeField(
                default=None,
                help_text="For sensor datapoints: The time the value was received by the connector.\nFor actuator datapoints: The time the message was created by the external entity.\nBoth in milliseconds since 1970-01-01 UTC.",
                interval="1 day",
            ),
        ),
    ]
