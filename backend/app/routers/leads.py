from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import json
import io
from datetime import datetime
import sys
import os

# Add the algorithms directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'algorithms'))

try:
    from market_analyzer import MarketAnalyzer, BusinessProfile
    MARKET_ANALYZER_AVAILABLE = True
except ImportError:
    MARKET_ANALYZER_AVAILABLE = False
    MarketAnalyzer = None
    BusinessProfile = None

from app.core.database import get_db
from sqlalchemy.orm import Session

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    openai = None

router = APIRouter()
analyzer = MarketAnalyzer() if MARKET_ANALYZER_AVAILABLE else None

class LeadExportRequest(BaseModel):
    lead_ids: List[int]
    format: str = "csv"
    include_contact_info: bool = True
    include_scores: bool = True

class LeadFilterRequest(BaseModel):
    min_revenue: Optional[float] = None
    max_revenue: Optional[float] = None
    min_succession_risk: Optional[float] = None
    max_succession_risk: Optional[float] = None
    min_lead_score: Optional[float] = None
    industry: Optional[str] = None
    location: Optional[str] = None

class OutreachRequest(BaseModel):
    business_name: str
    owner_name: Optional[str] = None
    industry: str
    location: str
    approach_type: str = "acquisition"
    tone: str = "professional"

@router.post("/export/crm")
async def export_leads_to_crm(request: LeadExportRequest, db: Session = Depends(get_db)):
    """Export leads to CRM-ready format"""
    try:
        leads_data = _get_mock_leads_data()
        
        if request.lead_ids:
            leads_data = [lead for lead in leads_data if lead.get('id') in request.lead_ids]
        
        export_data = []
        for lead in leads_data:
            export_row = {
                'Business Name': lead['name'],
                'Industry': lead['industry'],
                'Location': lead['location'],
                'Estimated Revenue': f"${lead['estimated_revenue']:,.0f}",
                'Employee Count': lead['employee_count'],
                'Years in Business': lead['years_in_business'],
                'Lead Score': f"{lead['lead_score']:.1f}/100",
                'Succession Risk': f"{lead['succession_risk_score']:.1f}/100"
            }
            
            if request.include_contact_info:
                export_row.update({
                    'Phone': lead.get('phone', ''),
                    'Website': lead.get('website', ''),
                    'Address': lead.get('address', '')
                })
            
            export_data.append(export_row)
        
        df = pd.DataFrame(export_data)
        
        if request.format.lower() == "csv":
            output = io.StringIO()
            df.to_csv(output, index=False)
            output.seek(0)
            
            return JSONResponse(
                content={"csv_data": output.getvalue()},
                headers={"Content-Disposition": f"attachment; filename=okapiq_leads_{datetime.now().strftime('%Y%m%d')}.csv"}
            )
        
        elif request.format.lower() == "json":
            return JSONResponse(content={"leads": export_data})
        
        else:
            raise HTTPException(status_code=400, detail="Unsupported export format")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.post("/filter")
async def filter_leads(request: LeadFilterRequest, db: Session = Depends(get_db)):
    """Filter leads based on criteria"""
    try:
        leads_data = _get_mock_leads_data()
        filtered_leads = leads_data
        
        if request.min_revenue:
            filtered_leads = [lead for lead in filtered_leads if lead['estimated_revenue'] >= request.min_revenue]
        
        if request.max_revenue:
            filtered_leads = [lead for lead in filtered_leads if lead['estimated_revenue'] <= request.max_revenue]
        
        if request.min_succession_risk:
            filtered_leads = [lead for lead in filtered_leads if lead['succession_risk_score'] >= request.min_succession_risk]
        
        if request.industry:
            filtered_leads = [lead for lead in filtered_leads if lead['industry'].lower() == request.industry.lower()]
        
        if request.location:
            filtered_leads = [lead for lead in filtered_leads if request.location.lower() in lead['location'].lower()]
        
        return {
            "total_leads": len(filtered_leads),
            "leads": filtered_leads,
            "filters_applied": request.dict(exclude_none=True)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lead filtering failed: {str(e)}")

@router.post("/outreach/generate")
async def generate_outreach_content(request: OutreachRequest):
    """Generate personalized outreach content"""
    try:
        cold_email = _generate_cold_email(request)
        call_script = _generate_call_script(request)
        
        return {
            "business_name": request.business_name,
            "approach_type": request.approach_type,
            "tone": request.tone,
            "cold_email": {
                "subject": cold_email["subject"],
                "body": cold_email["body"],
                "word_count": len(cold_email["body"].split())
            },
            "call_script": call_script,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outreach generation failed: {str(e)}")

def _get_mock_leads_data():
    """Generate mock lead data"""
    return [
        {
            'id': 1,
            'name': 'Golden Gate HVAC',
            'industry': 'HVAC',
            'location': 'San Francisco, CA',
            'estimated_revenue': 1200000,
            'employee_count': 15,
            'years_in_business': 25,
            'succession_risk_score': 75.0,
            'lead_score': 92.0,
            'owner_age_estimate': 62,
            'market_share_percent': 8.5,
            'yelp_rating': 4.2,
            'yelp_review_count': 89,
            'phone': '(415) 555-0123',
            'website': 'www.goldengatehvac.com',
            'address': '123 Market St, San Francisco, CA 94102'
        }
    ]

def _generate_cold_email(request: OutreachRequest) -> Dict[str, str]:
    """Generate personalized cold email"""
    return {
        "subject": f"Partnership Opportunity - {request.business_name}",
        "body": f"""Dear Owner,

I hope this message finds you well. I came across {request.business_name} and was impressed by your company's reputation in the {request.industry} industry.

I'm reaching out because we're actively looking to partner with established businesses like yours.

Would you be open to a brief call to discuss potential opportunities?

Best regards,
[Your Name]"""
    }

def _generate_call_script(request: OutreachRequest) -> Dict[str, Any]:
    """Generate call script"""
    return {
        "opening": f"Hi, this is [Your Name] calling about {request.business_name}.",
        "key_points": [
            "Mention their strong reputation",
            "Discuss partnership opportunities",
            "Ask about future plans"
        ],
        "closing": "Would you be interested in meeting to discuss this further?"
    }