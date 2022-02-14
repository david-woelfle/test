# Generated by Django 3.1.14 on 2022-02-08 19:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api_main", "0003_auto_20210927_1044"),
    ]

    operations = [
        migrations.RemoveField(model_name="datapoint", name="last_schedule",),
        migrations.RemoveField(
            model_name="datapoint", name="last_schedule_timestamp",
        ),
        migrations.RemoveField(model_name="datapoint", name="last_setpoint",),
        migrations.RemoveField(
            model_name="datapoint", name="last_setpoint_timestamp",
        ),
        migrations.RemoveField(model_name="datapoint", name="last_value",),
        migrations.RemoveField(
            model_name="datapoint", name="last_value_timestamp",
        ),
        migrations.AlterField(
            model_name="datapointschedule",
            name="datapoint",
            field=models.ForeignKey(
                help_text="The datapoint that the schedule message belongs to.",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="schedule_messages",
                to="api_main.datapoint",
            ),
        ),
        migrations.AlterField(
            model_name="datapointsetpoint",
            name="datapoint",
            field=models.ForeignKey(
                help_text="The datapoint that the setpoint message belongs to.",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="setpoint_messages",
                to="api_main.datapoint",
            ),
        ),
        migrations.AlterField(
            model_name="datapointvalue",
            name="datapoint",
            field=models.ForeignKey(
                help_text="The datapoint that the value message belongs to.",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="value_messages",
                to="api_main.datapoint",
            ),
        ),
        migrations.CreateModel(
            name="DatapointLastValue",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "value",
                    models.JSONField(
                        blank=True,
                        default=None,
                        help_text="The payload of the last received value message.",
                        null=True,
                    ),
                ),
                (
                    "time",
                    models.DateTimeField(
                        blank=True,
                        default=None,
                        help_text="The timestamp of the last received value message.",
                        null=True,
                    ),
                ),
                (
                    "datapoint",
                    models.OneToOneField(
                        help_text="The datapoint that the value message belongs to.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="last_value_message",
                        to="api_main.datapoint",
                    ),
                ),
            ],
            options={"abstract": False,},
        ),
        migrations.CreateModel(
            name="DatapointLastSetpoint",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "setpoint",
                    models.JSONField(
                        blank=True,
                        default=None,
                        help_text="The payload of the last received setpoint message.",
                        null=True,
                    ),
                ),
                (
                    "time",
                    models.DateTimeField(
                        blank=True,
                        default=None,
                        help_text="The timestamp of the last received setpoint message.",
                        null=True,
                    ),
                ),
                (
                    "datapoint",
                    models.OneToOneField(
                        help_text="The datapoint that the setpoint message belongs to.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="last_setpoint_message",
                        to="api_main.datapoint",
                    ),
                ),
            ],
            options={"abstract": False,},
        ),
        migrations.CreateModel(
            name="DatapointLastSchedule",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "schedule",
                    models.JSONField(
                        blank=True,
                        default=None,
                        help_text="The payload of the last received schedule message.",
                        null=True,
                    ),
                ),
                (
                    "time",
                    models.DateTimeField(
                        blank=True,
                        default=None,
                        help_text="The timestamp of the last received schedule message.",
                        null=True,
                    ),
                ),
                (
                    "datapoint",
                    models.OneToOneField(
                        help_text="The datapoint that the schedule message belongs to.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="last_schedule_message",
                        to="api_main.datapoint",
                    ),
                ),
            ],
            options={"abstract": False,},
        ),
    ]
