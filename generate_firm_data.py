"""
Generate 150+ realistic accounting firm results for Avilla Partners
Using real zip codes, NAICS data, and correlative factors
"""

import json
import random
import csv
from typing import List, Dict
import uuid

# Real zip codes with demographic data
MA_ZIP_CODES = [
    # Greater Boston
    {"zip": "02139", "city": "Cambridge", "metro": "Boston", "wealth_index": 89, "formation_rate": 14.2},
    {"zip": "02116", "city": "Boston", "metro": "Boston", "wealth_index": 92, "formation_rate": 16.8},
    {"zip": "02118", "city": "Boston", "metro": "Boston", "wealth_index": 73, "formation_rate": 11.4},
    {"zip": "02215", "city": "Boston", "metro": "Boston", "wealth_index": 85, "formation_rate": 13.7},
    {"zip": "01803", "city": "Burlington", "metro": "Boston", "wealth_index": 91, "formation_rate": 15.3},
    {"zip": "02420", "city": "Lexington", "metro": "Boston", "wealth_index": 96, "formation_rate": 12.1},
    {"zip": "02493", "city": "Weston", "metro": "Boston", "wealth_index": 98, "formation_rate": 8.9},
    {"zip": "01701", "city": "Framingham", "metro": "Boston", "wealth_index": 79, "formation_rate": 13.2},
    {"zip": "02101", "city": "Boston", "metro": "Boston", "wealth_index": 84, "formation_rate": 18.4},
    {"zip": "02114", "city": "Boston", "metro": "Boston", "wealth_index": 87, "formation_rate": 15.9},
    {"zip": "02138", "city": "Cambridge", "metro": "Boston", "wealth_index": 91, "formation_rate": 15.8},
    {"zip": "02142", "city": "Cambridge", "metro": "Boston", "wealth_index": 88, "formation_rate": 17.2},
    {"zip": "02134", "city": "Allston", "metro": "Boston", "wealth_index": 71, "formation_rate": 12.8},
    {"zip": "02135", "city": "Brighton", "metro": "Boston", "wealth_index": 74, "formation_rate": 13.1},
    {"zip": "02129", "city": "Charlestown", "metro": "Boston", "wealth_index": 86, "formation_rate": 14.9},
    {"zip": "02113", "city": "North End", "metro": "Boston", "wealth_index": 89, "formation_rate": 16.3},
    {"zip": "02109", "city": "Downtown", "metro": "Boston", "wealth_index": 87, "formation_rate": 19.1},
    {"zip": "02110", "city": "Financial District", "metro": "Boston", "wealth_index": 93, "formation_rate": 21.4},
    {"zip": "01906", "city": "Saugus", "metro": "Boston", "wealth_index": 78, "formation_rate": 11.7},
    {"zip": "02144", "city": "Somerville", "metro": "Boston", "wealth_index": 82, "formation_rate": 14.6},
    # Worcester Area
    {"zip": "01609", "city": "Worcester", "metro": "Worcester", "wealth_index": 68, "formation_rate": 9.8},
    {"zip": "01602", "city": "Worcester", "metro": "Worcester", "wealth_index": 71, "formation_rate": 10.4},
    {"zip": "01608", "city": "Worcester", "metro": "Worcester", "wealth_index": 65, "formation_rate": 9.2},
    {"zip": "01610", "city": "Worcester", "metro": "Worcester", "wealth_index": 69, "formation_rate": 10.1},
    # Springfield Area
    {"zip": "01103", "city": "Springfield", "metro": "Springfield", "wealth_index": 61, "formation_rate": 8.7},
    {"zip": "01109", "city": "Springfield", "metro": "Springfield", "wealth_index": 58, "formation_rate": 7.9},
    {"zip": "01118", "city": "Springfield", "metro": "Springfield", "wealth_index": 63, "formation_rate": 9.1},
    # Other MA cities
    {"zip": "01851", "city": "Lowell", "metro": "Lowell", "wealth_index": 74, "formation_rate": 11.6},
    {"zip": "01854", "city": "Lowell", "metro": "Lowell", "wealth_index": 72, "formation_rate": 11.2},
    {"zip": "01960", "city": "Peabody", "metro": "Boston", "wealth_index": 81, "formation_rate": 12.9},
]

FL_ZIP_CODES = [
    # Miami Metro
    {"zip": "33134", "city": "Coral Gables", "metro": "Miami", "wealth_index": 82, "formation_rate": 12.3},
    {"zip": "33139", "city": "Miami Beach", "metro": "Miami", "wealth_index": 85, "formation_rate": 15.7},
    {"zip": "33156", "city": "Pinecrest", "metro": "Miami", "wealth_index": 94, "formation_rate": 11.8},
    {"zip": "33133", "city": "Coconut Grove", "metro": "Miami", "wealth_index": 88, "formation_rate": 14.2},
    {"zip": "33131", "city": "Brickell", "metro": "Miami", "wealth_index": 91, "formation_rate": 17.3},
    {"zip": "33143", "city": "Kendall", "metro": "Miami", "wealth_index": 76, "formation_rate": 13.6},
    {"zip": "33176", "city": "Homestead", "metro": "Miami", "wealth_index": 64, "formation_rate": 9.4},
    {"zip": "33015", "city": "Hialeah", "metro": "Miami", "wealth_index": 59, "formation_rate": 8.8},
    {"zip": "33125", "city": "Hialeah", "metro": "Miami", "wealth_index": 61, "formation_rate": 9.1},
    {"zip": "33144", "city": "Coral Gables", "metro": "Miami", "wealth_index": 84, "formation_rate": 12.8},
    {"zip": "33145", "city": "Coral Gables", "metro": "Miami", "wealth_index": 86, "formation_rate": 13.1},
    {"zip": "33146", "city": "Coral Gables", "metro": "Miami", "wealth_index": 89, "formation_rate": 12.7},
    {"zip": "33149", "city": "Miami Beach", "metro": "Miami", "wealth_index": 87, "formation_rate": 16.2},
    {"zip": "33154", "city": "Bal Harbour", "metro": "Miami", "wealth_index": 96, "formation_rate": 10.4},
    {"zip": "33155", "city": "Kendall", "metro": "Miami", "wealth_index": 78, "formation_rate": 13.9},
    {"zip": "33157", "city": "Palmetto Bay", "metro": "Miami", "wealth_index": 91, "formation_rate": 12.6},
    {"zip": "33158", "city": "Aventura", "metro": "Miami", "wealth_index": 89, "formation_rate": 14.1},
    {"zip": "33160", "city": "Sunny Isles", "metro": "Miami", "wealth_index": 85, "formation_rate": 15.3},
    {"zip": "33161", "city": "North Miami Beach", "metro": "Miami", "wealth_index": 73, "formation_rate": 12.4},
    {"zip": "33162", "city": "North Miami Beach", "metro": "Miami", "wealth_index": 75, "formation_rate": 12.8},
    # Orlando Metro
    {"zip": "32801", "city": "Orlando", "metro": "Orlando", "wealth_index": 78, "formation_rate": 13.9},
    {"zip": "32803", "city": "Orlando", "metro": "Orlando", "wealth_index": 74, "formation_rate": 12.4},
    {"zip": "32789", "city": "Winter Springs", "metro": "Orlando", "wealth_index": 89, "formation_rate": 14.7},
    {"zip": "32835", "city": "Orlando", "metro": "Orlando", "wealth_index": 71, "formation_rate": 11.2},
    {"zip": "32804", "city": "Orlando", "metro": "Orlando", "wealth_index": 76, "formation_rate": 12.8},
    {"zip": "32806", "city": "Orlando", "metro": "Orlando", "wealth_index": 69, "formation_rate": 11.9},
    {"zip": "32807", "city": "Orlando", "metro": "Orlando", "wealth_index": 72, "formation_rate": 12.3},
    {"zip": "32808", "city": "Orlando", "metro": "Orlando", "wealth_index": 68, "formation_rate": 11.6},
    {"zip": "32809", "city": "Orlando", "metro": "Orlando", "wealth_index": 74, "formation_rate": 12.7},
    {"zip": "32810", "city": "Orlando", "metro": "Orlando", "wealth_index": 71, "formation_rate": 12.1},
    # Tampa Metro
    {"zip": "33602", "city": "Tampa", "metro": "Tampa", "wealth_index": 79, "formation_rate": 14.8},
    {"zip": "33606", "city": "Tampa", "metro": "Tampa", "wealth_index": 83, "formation_rate": 13.5},
    {"zip": "33629", "city": "Tampa", "metro": "Tampa", "wealth_index": 91, "formation_rate": 12.9},
    {"zip": "33647", "city": "Tampa", "metro": "Tampa", "wealth_index": 76, "formation_rate": 12.1},
    {"zip": "33607", "city": "Tampa", "metro": "Tampa", "wealth_index": 81, "formation_rate": 13.8},
    {"zip": "33609", "city": "Tampa", "metro": "Tampa", "wealth_index": 85, "formation_rate": 14.2},
    {"zip": "33611", "city": "Tampa", "metro": "Tampa", "wealth_index": 77, "formation_rate": 12.6},
    {"zip": "33612", "city": "Tampa", "metro": "Tampa", "wealth_index": 73, "formation_rate": 11.9},
    {"zip": "33613", "city": "Tampa", "metro": "Tampa", "wealth_index": 79, "formation_rate": 13.1},
    {"zip": "33614", "city": "Tampa", "metro": "Tampa", "wealth_index": 82, "formation_rate": 13.7},
    # Other FL metros
    {"zip": "32207", "city": "Jacksonville", "metro": "Jacksonville", "wealth_index": 72, "formation_rate": 10.8},
    {"zip": "32223", "city": "Jacksonville", "metro": "Jacksonville", "wealth_index": 77, "formation_rate": 12.3},
    {"zip": "32259", "city": "Jacksonville", "metro": "Jacksonville", "wealth_index": 86, "formation_rate": 13.7},
    {"zip": "33301", "city": "Fort Lauderdale", "metro": "Fort Lauderdale", "wealth_index": 81, "formation_rate": 13.4},
    {"zip": "33308", "city": "Fort Lauderdale", "metro": "Fort Lauderdale", "wealth_index": 87, "formation_rate": 12.1},
    {"zip": "33316", "city": "Fort Lauderdale", "metro": "Fort Lauderdale", "wealth_index": 75, "formation_rate": 11.8},
    {"zip": "33401", "city": "West Palm Beach", "metro": "West Palm Beach", "wealth_index": 80, "formation_rate": 12.7},
    {"zip": "33480", "city": "Palm Beach", "metro": "West Palm Beach", "wealth_index": 96, "formation_rate": 9.3},
    {"zip": "33414", "city": "Wellington", "metro": "West Palm Beach", "wealth_index": 90, "formation_rate": 11.4},
    {"zip": "34236", "city": "Sarasota", "metro": "Sarasota", "wealth_index": 88, "formation_rate": 10.6},
    {"zip": "34102", "city": "Naples", "metro": "Naples", "wealth_index": 95, "formation_rate": 8.7},
    {"zip": "34108", "city": "Naples", "metro": "Naples", "wealth_index": 97, "formation_rate": 7.4},
    {"zip": "32601", "city": "Gainesville", "metro": "Gainesville", "wealth_index": 69, "formation_rate": 11.9},
    {"zip": "32301", "city": "Tallahassee", "metro": "Tallahassee", "wealth_index": 73, "formation_rate": 12.8},
    {"zip": "32501", "city": "Pensacola", "metro": "Pensacola", "wealth_index": 67, "formation_rate": 9.7},
    {"zip": "33904", "city": "Cape Coral", "metro": "Cape Coral", "wealth_index": 76, "formation_rate": 11.3},
    {"zip": "33901", "city": "Fort Myers", "metro": "Fort Myers", "wealth_index": 74, "formation_rate": 10.9},
]

# Realistic firm name components
FIRM_PREFIXES = [
    "Premier", "Elite", "Professional", "Trusted", "Advanced", "Strategic", "Executive", 
    "Capital", "Summit", "Pinnacle", "First Choice", "Precision", "Excellence", "Quality",
    "Metro", "Regional", "Local", "Community", "Family", "Heritage", "Legacy", "Crown",
    "Bay Area", "Coastal", "Downtown", "Uptown", "Midtown", "Central", "North", "South",
    "East", "West", "Harbor", "Park", "Grove", "Hills", "Valley", "Ridge"
]

FIRM_SUFFIXES = [
    "CPA", "CPAs", "Accounting", "Tax Services", "Financial Services", "Business Services",
    "Tax Advisors", "Financial Advisors", "Bookkeeping", "Consulting", "Associates",
    "Partners", "Group", "Firm", "Company", "Corporation", "LLC", "Professional Corporation",
    "Tax Preparation", "Audit Services", "Advisory Services", "Solutions", "Specialists"
]

OWNER_FIRST_NAMES = [
    "Michael", "David", "John", "Robert", "William", "James", "Richard", "Thomas", "Mark", "Paul",
    "Steven", "Kenneth", "Joseph", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew",
    "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric", "Stephen", "Andrew",
    "Susan", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth",
    "Sharon", "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Dorothy", "Amy", "Angela", "Ashley"
]

OWNER_LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
]

SUBINDUSTRIES = [
    {"name": "CPA Firms", "naics": "541211", "avg_multiple": 3.5},
    {"name": "Tax Preparation", "naics": "541213", "avg_multiple": 2.8},
    {"name": "Bookkeeping Services", "naics": "541219", "avg_multiple": 3.1},
    {"name": "Payroll Services", "naics": "541214", "avg_multiple": 3.8},
    {"name": "Forensic Accounting", "naics": "541211", "avg_multiple": 4.2},
    {"name": "Estate Planning", "naics": "541211", "avg_multiple": 3.9},
]

def generate_firm_name() -> str:
    """Generate realistic accounting firm name"""
    if random.random() < 0.3:  # 30% chance of owner name in firm
        first_name = random.choice(OWNER_FIRST_NAMES)
        last_name = random.choice(OWNER_LAST_NAMES)
        suffix = random.choice(["CPA", "CPAs", "& Associates", "Tax Services", "Accounting"])
        return f"{first_name} {last_name} {suffix}"
    else:
        prefix = random.choice(FIRM_PREFIXES)
        suffix = random.choice(FIRM_SUFFIXES)
        return f"{prefix} {suffix}"

def generate_owner_name() -> str:
    """Generate realistic owner name"""
    first = random.choice(OWNER_FIRST_NAMES)
    last = random.choice(OWNER_LAST_NAMES)
    return f"{first} {last}"

def calculate_succession_risk(owner_age: int, years_established: int, has_website: bool, review_count: int) -> int:
    """Calculate succession risk score (0-100)"""
    risk = 0
    
    # Age factor (40% of score)
    if owner_age >= 70:
        risk += 40
    elif owner_age >= 65:
        risk += 35
    elif owner_age >= 60:
        risk += 25
    elif owner_age >= 55:
        risk += 15
    elif owner_age >= 50:
        risk += 5
    
    # Business age factor (25% of score)
    if years_established >= 30:
        risk += 25
    elif years_established >= 20:
        risk += 20
    elif years_established >= 15:
        risk += 15
    elif years_established >= 10:
        risk += 10
    
    # Digital presence factor (20% of score)
    if not has_website:
        risk += 15
    if review_count < 10:
        risk += 5
    
    # Random business factors (15% of score)
    risk += random.randint(0, 15)
    
    return min(risk, 100)

def calculate_deal_score(firm_data: Dict, zip_data: Dict) -> int:
    """Calculate composite deal score (0-100)"""
    score = 0
    
    # Revenue strength (25%)
    revenue = firm_data["revenue_estimate"]
    if 1000000 <= revenue <= 5000000:
        score += 25
    elif 500000 <= revenue < 1000000:
        score += 20
    elif revenue > 5000000:
        score += 22
    else:
        score += 12
    
    # Market factors (25%)
    wealth_index = zip_data["wealth_index"]
    formation_rate = zip_data["formation_rate"]
    
    score += min(wealth_index * 0.15, 15)  # Wealth contribution
    score += min(formation_rate * 0.7, 10)  # Formation rate contribution
    
    # Digital presence (20%)
    if firm_data["website"]:
        score += 10
    if firm_data["yelp_review_count"] >= 20:
        score += 5
    if firm_data["yelp_rating"] >= 4.0:
        score += 5
    
    # Succession opportunity (15%)
    succession_risk = firm_data["succession_risk_score"]
    if succession_risk >= 70:
        score += 15  # High succession = opportunity
    elif succession_risk >= 50:
        score += 12
    elif succession_risk >= 30:
        score += 8
    else:
        score += 3
    
    # Business stability (15%)
    if firm_data["years_established"] >= 10:
        score += 8
    if firm_data["employee_count"] >= 5:
        score += 4
    if firm_data["yelp_rating"] >= 3.5:
        score += 3
    
    return min(score, 100)

def generate_realistic_firm(zip_data: Dict, firm_id: int) -> Dict:
    """Generate a single realistic accounting firm"""
    
    # Basic info
    firm_name = generate_firm_name()
    owner_name = generate_owner_name()
    owner_age = random.randint(35, 75)
    years_established = random.randint(3, 40)
    subindustry = random.choice(SUBINDUSTRIES)
    
    # Size factors (correlated with wealth index)
    wealth_factor = zip_data["wealth_index"] / 100
    base_revenue = random.randint(400000, 8000000)
    revenue_estimate = int(base_revenue * (0.7 + wealth_factor * 0.6))
    
    # Employee count (roughly correlated with revenue)
    if revenue_estimate < 750000:
        employee_count = random.randint(2, 8)
    elif revenue_estimate < 2000000:
        employee_count = random.randint(5, 15)
    elif revenue_estimate < 5000000:
        employee_count = random.randint(10, 25)
    else:
        employee_count = random.randint(15, 45)
    
    # Digital presence (newer firms more likely to have websites)
    has_website = random.random() < (0.4 + (40 - years_established) * 0.015)
    
    # Review metrics
    yelp_review_count = random.randint(0, 150) if has_website else random.randint(0, 30)
    yelp_rating = random.uniform(2.5, 5.0)
    google_review_count = int(yelp_review_count * random.uniform(0.6, 1.8))
    google_rating = yelp_rating + random.uniform(-0.3, 0.3)
    google_rating = max(2.0, min(5.0, google_rating))
    
    # Contact info
    phone = f"({random.randint(200, 999)}) {random.randint(200, 999)}-{random.randint(1000, 9999)}"
    email_domain = firm_name.lower().replace(" ", "").replace("&", "and")[:15] + random.choice([".com", "cpa.com", "tax.com"])
    email = f"info@{email_domain}"
    
    website = f"www.{email_domain}" if has_website else None
    
    # Calculate scores
    succession_risk_score = calculate_succession_risk(owner_age, years_established, has_website, yelp_review_count)
    
    firm_data = {
        "firm_id": f"firm_{firm_id:04d}",
        "name": firm_name,
        "owner_name": owner_name,
        "owner_age_estimate": owner_age,
        "address": f"{random.randint(1, 9999)} {random.choice(['Main', 'Oak', 'Park', 'Elm', 'First', 'Second', 'Third', 'Business', 'Commerce'])} {random.choice(['St', 'Ave', 'Blvd', 'Dr', 'Way'])}",
        "city": zip_data["city"],
        "state": "MA" if zip_data["zip"].startswith(("01", "02")) else "FL",
        "zip_code": zip_data["zip"],
        "metro": zip_data["metro"],
        "phone": phone,
        "email": email,
        "website": website,
        "subindustry": subindustry["name"],
        "naics_code": subindustry["naics"],
        "revenue_estimate": revenue_estimate,
        "employee_count": employee_count,
        "years_established": years_established,
        "yelp_rating": round(yelp_rating, 1),
        "yelp_review_count": yelp_review_count,
        "google_rating": round(google_rating, 1),
        "google_review_count": google_review_count,
        "succession_risk_score": succession_risk_score,
        "wealth_index": zip_data["wealth_index"],
        "formation_rate": zip_data["formation_rate"],
        "estimated_ebitda": int(revenue_estimate * random.uniform(0.15, 0.35)),
        "estimated_multiple": subindustry["avg_multiple"] + random.uniform(-0.5, 0.5),
    }
    
    # Calculate final deal score
    firm_data["deal_score"] = calculate_deal_score(firm_data, zip_data)
    
    return firm_data

def generate_all_firms() -> List[Dict]:
    """Generate 150+ firms across MA and FL"""
    all_zip_codes = MA_ZIP_CODES + FL_ZIP_CODES
    all_firms = []
    
    firm_id = 1
    
    # Generate firms for each zip code
    for zip_data in all_zip_codes:
        # Number of firms per zip based on wealth and formation rate
        base_firms = 2
        wealth_bonus = int(zip_data["wealth_index"] / 20)  # 0-5 bonus firms
        formation_bonus = int(zip_data["formation_rate"] / 5)  # 0-4 bonus firms
        
        num_firms = base_firms + wealth_bonus + formation_bonus + random.randint(0, 3)
        num_firms = min(num_firms, 8)  # Cap at 8 firms per zip
        
        for _ in range(num_firms):
            firm = generate_realistic_firm(zip_data, firm_id)
            all_firms.append(firm)
            firm_id += 1
    
    # Sort by deal score (highest first)
    all_firms.sort(key=lambda x: x["deal_score"], reverse=True)
    
    return all_firms

def save_firms_to_files(firms: List[Dict]):
    """Save firms to various formats"""
    
    # Save as JSON
    with open('/Users/osirislamon/Documents/GitHub/oc_startup/avilla_firms_database.json', 'w') as f:
        json.dump(firms, f, indent=2)
    
    # Save as CSV
    csv_fields = [
        'firm_id', 'name', 'owner_name', 'owner_age_estimate', 'address', 'city', 'state', 
        'zip_code', 'metro', 'phone', 'email', 'website', 'subindustry', 'naics_code',
        'revenue_estimate', 'employee_count', 'years_established', 'yelp_rating', 
        'yelp_review_count', 'google_rating', 'google_review_count', 'succession_risk_score',
        'wealth_index', 'formation_rate', 'estimated_ebitda', 'estimated_multiple', 'deal_score'
    ]
    
    with open('/Users/osirislamon/Documents/GitHub/oc_startup/avilla_firms_database.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields)
        writer.writeheader()
        writer.writerows(firms)
    
    # Create summary statistics
    ma_firms = [f for f in firms if f['state'] == 'MA']
    fl_firms = [f for f in firms if f['state'] == 'FL']
    
    summary = {
        "total_firms": len(firms),
        "ma_firms": len(ma_firms),
        "fl_firms": len(fl_firms),
        "high_score_firms": len([f for f in firms if f['deal_score'] >= 80]),
        "succession_opportunities": len([f for f in firms if f['succession_risk_score'] >= 70]),
        "avg_revenue": sum(f['revenue_estimate'] for f in firms) / len(firms),
        "avg_deal_score": sum(f['deal_score'] for f in firms) / len(firms),
        "top_metros": {},
        "subindustry_breakdown": {}
    }
    
    # Metro breakdown
    metros = {}
    for firm in firms:
        metro = firm['metro']
        if metro not in metros:
            metros[metro] = {"count": 0, "avg_score": 0, "total_score": 0}
        metros[metro]["count"] += 1
        metros[metro]["total_score"] += firm['deal_score']
    
    for metro in metros:
        metros[metro]["avg_score"] = metros[metro]["total_score"] / metros[metro]["count"]
    
    summary["top_metros"] = dict(sorted(metros.items(), key=lambda x: x[1]["avg_score"], reverse=True))
    
    # Subindustry breakdown
    subindustries = {}
    for firm in firms:
        sub = firm['subindustry']
        if sub not in subindustries:
            subindustries[sub] = 0
        subindustries[sub] += 1
    
    summary["subindustry_breakdown"] = subindustries
    
    with open('/Users/osirislamon/Documents/GitHub/oc_startup/avilla_summary_stats.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    return summary

if __name__ == "__main__":
    print("Generating 150+ realistic accounting firms for Avilla Partners...")
    
    firms = generate_all_firms()
    summary = save_firms_to_files(firms)
    
    print(f"\n✅ Generated {len(firms)} firms:")
    print(f"   📍 Massachusetts: {summary['ma_firms']} firms")
    print(f"   📍 Florida: {summary['fl_firms']} firms")
    print(f"   🎯 High-scoring targets (80+): {summary['high_score_firms']}")
    print(f"   🔄 Succession opportunities (70+): {summary['succession_opportunities']}")
    print(f"   💰 Average revenue: ${summary['avg_revenue']:,.0f}")
    print(f"   📊 Average deal score: {summary['avg_deal_score']:.1f}/100")
    
    print(f"\n📁 Files created:")
    print(f"   • avilla_firms_database.json")
    print(f"   • avilla_firms_database.csv") 
    print(f"   • avilla_summary_stats.json")
    
    print(f"\n🏆 Top metros by deal score:")
    for metro, data in list(summary['top_metros'].items())[:5]:
        print(f"   • {metro}: {data['count']} firms, avg score {data['avg_score']:.1f}")
