import json
import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add the parent directory to the path so we can import from there
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from utils.fhir_utils import load_patients_fhir

client = TestClient(app)

TEST_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
TEST_PATIENTS_FILE = os.path.join(TEST_DATA_DIR, "patients.json")

test_patients = load_patients_fhir(TEST_PATIENTS_FILE)

def test_list_patients_default_limit():
    """Test that the patients endpoint returns at most 10 patients by default."""
    assert len(test_patients) > 10, "Test data should contain more than 10 patients"
    
    response = client.get("/patients")
    assert response.status_code == 200
    
    patients = response.json()
    assert len(patients) <= 10, f"Expected 10 or fewer patients, got {len(patients)}"


def test_list_patients_custom_limit():
    """Test that the patients endpoint respects custom limit parameter."""
    assert len(test_patients) >= 5, "Test data should contain at least 5 patients"
    
    response = client.get("/patients?limit=5")
    assert response.status_code == 200
    
    patients = response.json()
    assert len(patients) == 5, f"Expected 5 patients, got {len(patients)}"


def test_patient_search_case_insensitive():
    """Test that patient search is case insensitive."""
    assert len(test_patients) > 0, "Test data should contain patients"
    
    # Get the first patient's name to search for
    first_patient = test_patients[0]
    patient_name = ""
    if first_patient.get("name") and len(first_patient["name"]) > 0:
        name_obj = first_patient["name"][0]
        given_names = " ".join(name_obj.get("given", []))
        family_name = name_obj.get("family", "")
        patient_name = f"{given_names} {family_name}".strip()
    
    assert patient_name, "First patient should have a name"
    
    uppercase_name = patient_name.upper()
    name_fragment = uppercase_name.split()[0]
    response = client.get(f"/patients?name={name_fragment}")
    
    assert response.status_code == 200
    patients = response.json()
    
    assert len(patients) > 0, "Expected at least one patient in search results"
    assert name_fragment.lower() in patients[0]["full_name"].lower(), \
        f"Expected '{name_fragment.lower()}' in '{patients[0]['full_name'].lower()}'"


def test_patient_search_by_name():
    """Test that patient search by name works correctly."""
    # Get a unique substring from a patient name to ensure specific results
    # Choose the middle patient for diversity
    middle_index = len(test_patients) // 2
    middle_patient = test_patients[middle_index]
    
    patient_name = ""
    if middle_patient.get("name") and len(middle_patient["name"]) > 0:
        name_obj = middle_patient["name"][0]
        family_name = name_obj.get("family", "")
        patient_name = family_name
    
    assert patient_name, "Middle patient should have a family name"
    
    response = client.get(f"/patients?name={patient_name}")
    assert response.status_code == 200
    
    patients = response.json()
    assert len(patients) > 0, "Expected at least one patient in search results"
    
    for patient in patients:
        assert patient_name.lower() in patient["full_name"].lower(), \
            f"Expected '{patient_name.lower()}' in '{patient['full_name'].lower()}'"


def test_patient_search_no_results():
    """Test that patient search returns empty list when no matches."""
    response = client.get("/patients?name=FakeNameThatDoesNotExist")
    
    assert response.status_code == 200
    
    patients = response.json()
    assert len(patients) == 0, "Expected no patients in search results" 