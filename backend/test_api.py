"""Quick API integration test."""
import requests

BASE = "http://localhost:8000"

# Test 1: Create project
print("=== Creating project ===")
r = requests.post(f"{BASE}/projects", json={
    "client_name": "Test Client",
    "event_title": "Test Wedding",
    "location": "Bhubaneswar",
    "contact_number": "1234567890",
    "total_budget": 150000,
    "status": "Pending"
})
print(f"POST /projects: {r.status_code}")
if r.status_code != 201:
    print(r.text)
    exit()
project = r.json()
pid = project["id"]
print(f"Created project #{pid}")

# Test 2: PATCH with events + deliverables + payments
print("\n=== Patching project with events/deliverables/payments ===")
r2 = requests.patch(f"{BASE}/projects/{pid}", json={
    "events": [
        {"event_type": "Engagement", "event_date": "2026-06-15"},
        {"event_type": "Marriage", "event_date": "2026-07-01"}
    ],
    "deliverables": [
        {"category": "Photography", "description": "90 Edited Photos", "details": {"count": 90}, "status": "Pending"},
        {"category": "Videography", "description": "7 Reels", "details": {"count": 7}, "status": "Pending"}
    ],
    "payments": [
        {"milestone": "1st - Advance", "amount": 22500, "is_paid": True},
        {"milestone": "2nd - Marriage", "amount": 52500, "is_paid": False}
    ]
})
print(f"PATCH /projects/{pid}: {r2.status_code}")
if r2.status_code != 200:
    print(r2.text)
    exit()
data = r2.json()

print(f"\nEvents saved: {len(data['events'])}")
for e in data["events"]:
    print(f"  - {e['event_type']} on {e['event_date']}")

print(f"\nDeliverables saved: {len(data['deliverables'])}")
for d in data["deliverables"]:
    print(f"  - [{d['category']}] {d['description']} | status={d['status']}")

print(f"\nPayments saved: {len(data['payments'])}")
for p in data["payments"]:
    print(f"  - {p['milestone']}: Rs.{p['amount']} | is_paid={p['is_paid']}")

# Test 3: Calendar
print("\n=== Calendar events ===")
r3 = requests.get(f"{BASE}/projects/calendar/events")
print(f"GET /projects/calendar/events: {r3.status_code}")
for ev in r3.json():
    print(f"  {ev['date']} - {ev['title']} ({ev['source']})")

# Test 4: Verify GET project returns full data
print("\n=== GET project detail ===")
r4 = requests.get(f"{BASE}/projects/{pid}")
detail = r4.json()
print(f"Events: {len(detail['events'])}, Deliverables: {len(detail['deliverables'])}, Payments: {len(detail['payments'])}")
paid_count = sum(1 for p in detail["payments"] if p["is_paid"])
print(f"Paid payments: {paid_count}/{len(detail['payments'])}")

print("\n=== ALL TESTS PASSED ===")
