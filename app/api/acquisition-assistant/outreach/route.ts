import { NextRequest, NextResponse } from 'next/server';
import { acquisitionAssistant } from '@/services/acquisition-assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealId, action } = body;

    if (!dealId) {
      return NextResponse.json({ error: 'Deal ID required' }, { status: 400 });
    }

    const deal = await acquisitionAssistant.getDealData(dealId);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    switch (action) {
      case 'generateSequences':
        const followUps = await acquisitionAssistant.generateOutreachSequences({
          targetName: deal.targetCompany.name,
          lastContactDate: deal.lastContact,
          dealStage: deal.stage,
          contacts: deal.contacts
        });
        return NextResponse.json({ followUps });

      case 'updateContactInfo':
        const { contactData } = body;
        if (!contactData) {
          return NextResponse.json({ error: 'Contact data required' }, { status: 400 });
        }
        
        // Update contact information
        const updatedContacts = [...deal.contacts];
        const existingContactIndex = updatedContacts.findIndex(c => c.email === contactData.email);
        
        if (existingContactIndex >= 0) {
          updatedContacts[existingContactIndex] = { ...updatedContacts[existingContactIndex], ...contactData };
        } else {
          updatedContacts.push({
            name: contactData.name || 'Unknown',
            role: contactData.role || 'Contact',
            email: contactData.email,
            phone: contactData.phone,
            lastContact: new Date(),
            responseRate: contactData.responseRate || 0.5,
            sentimentScore: contactData.sentimentScore || 0.5
          });
        }

        const updatedDeal = acquisitionAssistant.updateDeal(dealId, {
          contacts: updatedContacts,
          lastContact: new Date()
        });

        return NextResponse.json({ deal: updatedDeal });

      case 'trackResponse':
        const { responseData } = body;
        if (!responseData) {
          return NextResponse.json({ error: 'Response data required' }, { status: 400 });
        }

        // Update response tracking
        const contactIndex = deal.contacts.findIndex(c => c.email === responseData.email);
        if (contactIndex >= 0) {
          const contact = deal.contacts[contactIndex];
          contact.responseRate = (contact.responseRate + responseData.responded ? 1 : 0) / 2;
          contact.sentimentScore = responseData.sentimentScore || contact.sentimentScore;
          contact.lastContact = new Date();
        }

        const responseUpdatedDeal = acquisitionAssistant.updateDeal(dealId, {
          contacts: deal.contacts,
          lastContact: new Date()
        });

        return NextResponse.json({ deal: responseUpdatedDeal });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Outreach API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}