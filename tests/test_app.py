from copy import deepcopy

import pytest
from fastapi.testclient import TestClient

from src.app import activities, app


@pytest.fixture
def client():
    original_activities = deepcopy(activities)
    with TestClient(app) as test_client:
        yield test_client
    activities.clear()
    activities.update(original_activities)


def test_signup_for_activity_adds_participant(client):
    email = "new.student@mergington.edu"

    response = client.post(
        "/activities/Chess Club/signup",
        params={"email": email},
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": f"Signed up {email} for Chess Club",
    }
    assert email in activities["Chess Club"]["participants"]


def test_signup_for_unknown_activity_returns_not_found(client):
    response = client.post(
        "/activities/Unknown Club/signup",
        params={"email": "student@mergington.edu"},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Activity not found"}


def test_signup_for_activity_rejects_duplicate_participant(client):
    email = activities["Chess Club"]["participants"][0]

    response = client.post(
        "/activities/Chess Club/signup",
        params={"email": email},
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Student is already signed up for this activity",
    }


def test_signup_without_email_returns_validation_error(client):
    response = client.post("/activities/Chess Club/signup")

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["query", "email"]
