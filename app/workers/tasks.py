import time

from app.workers.celery_app import celery


@celery.task
def send_email_task(email: str, subject: str, message: str):
    # simulate delay
    time.sleep(5)

    print(f"Email sent to {email}: {subject}")


@celery.task
def generate_report_task(user_id: str):
    time.sleep(10)

    return f"Report generated for user {user_id}"