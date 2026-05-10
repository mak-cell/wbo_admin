import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, radius, breakpoints } from '../styles/designTokens';
import { ApiService } from '../services/apiService';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;

  h1 { font-size: 2.5rem; margin-bottom: ${spacing[2]}; color: ${colors.primary}; }
  p { color: ${colors.onSurface}; opacity: 0.8; }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease 0.2s both;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: ${colors.onBackground};
  border-bottom: 1px solid ${colors.border};
  padding-bottom: ${spacing[2]};
  margin-bottom: ${spacing[4]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 2}, 1fr);
  gap: ${spacing[6]};

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; position: relative;

  label {
    font-size: 0.85rem; font-weight: 600; color: ${colors.onSurface}; margin-bottom: 6px;
  }

  input, select, textarea {
    padding: 12px 14px;
    border-radius: ${radius.md};
    border: 1px solid ${colors.border};
    background: ${colors.surface};
    color: ${colors.onBackground};
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus { outline: none; border-color: ${colors.primary}; box-shadow: 0 0 0 1px ${colors.primary}; }
  }
`;

const ToggleGroup = styled.div`
  display: flex; gap: ${spacing[2]}; background: rgba(255,255,255,0.05); padding: 4px; border-radius: ${radius.md}; width: fit-content;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px; border: none; border-radius: ${radius.sm};
  background: ${({ $active }) => $active ? colors.primary : 'transparent'};
  color: ${({ $active }) => $active ? colors.background : colors.onSurface};
  font-weight: 600; cursor: pointer; transition: all 0.2s;
`;

const PaymentRow = styled.div`
  display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: ${spacing[4]}; align-items: center;
  padding: ${spacing[3]}; background: rgba(255,255,255,0.02); border: 1px solid ${colors.border}; border-radius: ${radius.md};
  margin-bottom: ${spacing[2]};
`;

const EVENT_TYPES = [
  { id: "Engagement", label: "Engagement" },
  { id: "Prewedding", label: "Pre-Wedding", hasLocation: true },
  { id: "Mehendi", label: "Mehendi (Groom)" },
  { id: "Marriage", label: "Marriage" },
  { id: "Reception", label: "Reception" }
];

const todayStr = new Date().toISOString().split('T')[0];

export default function IntakeForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Client Type & Info
  const [sideType, setSideType] = useState<"ONE_SIDE" | "BOTH_SIDES">("ONE_SIDE");
  const [clientName1, setClientName1] = useState("");
  const [contact1, setContact1] = useState("");
  const [location1, setLocation1] = useState("");
  
  const [clientName2, setClientName2] = useState("");
  const [contact2, setContact2] = useState("");
  const [location2, setLocation2] = useState("");
  
  const [reference, setReference] = useState("");

  // 2. Events (date1 for Bride/OneSide, date2 for Groom)
  const [events, setEvents] = useState<{ [key: string]: { date1: string, date2?: string, location?: string } }>({});

  const toggleEvent = (id: string, hasLocation: boolean) => {
    const updated = { ...events };
    if (updated[id]) delete updated[id];
    else updated[id] = hasLocation ? { date1: todayStr, date2: todayStr, location: "" } : { date1: todayStr, date2: todayStr };
    setEvents(updated);
  };

  const updateEvent = (id: string, field: 'date1' | 'date2' | 'location', value: string) => {
    setEvents({ ...events, [id]: { ...events[id], [field]: value } });
  };

  // 3. Budget & Payments
  const [basePrice, setBasePrice] = useState(150000);
  const [discount, setDiscount] = useState(0);
  const finalPrice = Math.max(0, basePrice - discount);

  // The user can type any advance amount. We default to 15% if it hasn't been manually touched,
  // but to keep it simple, we'll store the exact typed string and parse it.
  const [customAdvance, setCustomAdvance] = useState<string>("");
  
  const advanceValue = customAdvance !== "" ? Number(customAdvance) : (finalPrice * 0.15);
  const remainingBalance = Math.max(0, finalPrice - advanceValue);

  // Weights for the remaining 4 milestones (sum to 85)
  // Prewed 20%, Eng 15%, Marriage 30%, Reception 20%
  const wPrewed = 20/85;
  const wEng = 15/85;
  const wMarriage = 30/85;
  const wReception = 20/85;

  const [paymentStatuses, setPaymentStatuses] = useState({
    advance: 'UNPAID',
    prewed: 'UNPAID',
    eng: 'UNPAID',
    marriage: 'UNPAID',
    reception: 'UNPAID'
  });

  const updatePaymentStatus = (key: keyof typeof paymentStatuses, status: string) => {
    setPaymentStatuses({ ...paymentStatuses, [key]: status });
  };

  // 4. Deliverables
  const [deliverables, setDeliverables] = useState({
    editedPhotos: 90,
    albumsCount: 3,
    albumSize: "Small",
    albumPages: 130,
    photoFrames: 3,
    photoFrameSize: "12*18",
    tradVideoHours: "1.5 hrs",
    cinematics: "30 min * 2",
    teaser: 1,
    highlight: 1,
    reelsCount: 7,
    prewedVideo: "4-5 min",
    prewedCinematicReel: 1,
    prewedSaveDateReel: 1,
    prewedAlbum: "15 pages (1)"
  });

  const updateDeliv = (key: keyof typeof deliverables, value: string | number) => {
    setDeliverables({ ...deliverables, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Base Project
      const finalClientName = sideType === "BOTH_SIDES" ? `${clientName1} & ${clientName2}` : clientName1;
      const combinedLocation = sideType === "BOTH_SIDES" ? `${location1} / ${location2}` : location1;
      const combinedContact = sideType === "BOTH_SIDES" ? `${contact1} / ${contact2}` : contact1;

      const projectData = {
        client_name: finalClientName,
        event_title: sideType === "BOTH_SIDES" ? "Both Sides Wedding" : "One Side Wedding",
        location: combinedLocation || "Not specified",
        contact_number: combinedContact,
        instagram_reference: reference,
        total_budget: finalPrice,
        status: "Pending"
      };
      
      const project = await ApiService.createProject(projectData);

      // Events Payload
      const eventsPayload = Object.entries(events).map(([type, data]) => {
        let title = data.location ? `${type} (${data.location})` : type;
        if (sideType === "BOTH_SIDES") {
           // We will create two events for both sides to properly capture the dates if needed,
           // or we just save the Bride's date for simplicity in the backend for now,
           // but let's just make the title verbose:
           title = `${title} [Bride: ${data.date1}, Groom: ${data.date2}]`;
        }
        return {
          event_type: title,
          event_date: data.date1 || todayStr
        };
      });

      // Deliverables Payload — each item is a trackable task
      const deliverablePayload: any[] = [
        { category: "Photography", description: `${deliverables.editedPhotos} Edited Photos`, details: { count: deliverables.editedPhotos }, status: "Pending" },
        { category: "Photography", description: `${deliverables.albumsCount} Albums (${deliverables.albumSize}, ${deliverables.albumPages} pages)`, details: { count: deliverables.albumsCount, size: deliverables.albumSize, pages: deliverables.albumPages }, status: "Pending" },
        { category: "Photography", description: `${deliverables.photoFrames} Photo Frames (${deliverables.photoFrameSize})`, details: { count: deliverables.photoFrames, size: deliverables.photoFrameSize }, status: "Pending" },
        { category: "Videography", description: `Traditional Video (${deliverables.tradVideoHours})`, details: { duration: deliverables.tradVideoHours }, status: "Pending" },
        { category: "Videography", description: `Cinematics (${deliverables.cinematics})`, details: { duration: deliverables.cinematics }, status: "Pending" },
        { category: "Videography", description: `${deliverables.teaser} Teaser`, details: { count: deliverables.teaser }, status: "Pending" },
        { category: "Videography", description: `${deliverables.highlight} Highlight`, details: { count: deliverables.highlight }, status: "Pending" },
        { category: "Videography", description: `${deliverables.reelsCount} Reels`, details: { count: deliverables.reelsCount }, status: "Pending" },
        { category: "Pre-Wedding", description: `Pre-Wedding Video (${deliverables.prewedVideo})`, details: { duration: deliverables.prewedVideo }, status: "Pending" },
        { category: "Pre-Wedding", description: `${deliverables.prewedCinematicReel} Cinematic Reel`, details: { count: deliverables.prewedCinematicReel }, status: "Pending" },
        { category: "Pre-Wedding", description: `${deliverables.prewedSaveDateReel} Save the Date Reel`, details: { count: deliverables.prewedSaveDateReel }, status: "Pending" },
        { category: "Pre-Wedding", description: `Pre-Wedding Album (${deliverables.prewedAlbum})`, details: { spec: deliverables.prewedAlbum }, status: "Pending" },
      ];

      // Payments Payload
      const paymentsPayload = [
        { milestone: '1st - Advance', amount: advanceValue, is_paid: paymentStatuses.advance === 'PAID' },
        { milestone: '2nd - Prewedding Day', amount: remainingBalance * wPrewed, is_paid: paymentStatuses.prewed === 'PAID' },
        { milestone: '3rd - Engagement', amount: remainingBalance * wEng, is_paid: paymentStatuses.eng === 'PAID' },
        { milestone: '4th - Marriage', amount: remainingBalance * wMarriage, is_paid: paymentStatuses.marriage === 'PAID' },
        { milestone: '5th - Reception', amount: remainingBalance * wReception, is_paid: paymentStatuses.reception === 'PAID' }
      ];

      await ApiService.updateProject(project.id, {
        events: eventsPayload.length > 0 ? eventsPayload : undefined,
        deliverables: deliverablePayload,
        payments: paymentsPayload
      });

      alert("Intake successful! Project, Events, Deliverables, and Payments created.");
      navigate(`/projects/${project.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create project. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageHeader>
        <h1>Complete Client Intake</h1>
        <p>Configure sides, dates, exact deliverables, and payment schedule.</p>
      </PageHeader>

      <Card style={{ padding: spacing[8] }}>
        <FormContainer onSubmit={handleSubmit}>
          
          {/* SECTION: CLIENT DETAILS */}
          <div>
            <SectionTitle>
              Client Details
              <ToggleGroup>
                <ToggleButton type="button" $active={sideType === 'ONE_SIDE'} onClick={() => setSideType('ONE_SIDE')}>One Side</ToggleButton>
                <ToggleButton type="button" $active={sideType === 'BOTH_SIDES'} onClick={() => setSideType('BOTH_SIDES')}>Both Sides</ToggleButton>
              </ToggleGroup>
            </SectionTitle>

            <FormGrid $cols={sideType === 'BOTH_SIDES' ? 2 : 1}>
              {/* Client 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], background: 'rgba(255,255,255,0.02)', padding: spacing[4], borderRadius: radius.md, border: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.primary }}>{sideType === 'BOTH_SIDES' ? "Bride Side Details" : "Client Details"}</h4>
                <FormGroup><label>Name *</label><input type="text" value={clientName1} onChange={e => setClientName1(e.target.value)} required /></FormGroup>
                <FormGroup><label>Contact Number *</label><input type="tel" value={contact1} onChange={e => setContact1(e.target.value)} required /></FormGroup>
                <FormGroup><label>Location / City *</label><input type="text" value={location1} onChange={e => setLocation1(e.target.value)} required /></FormGroup>
              </div>

              {/* Client 2 */}
              {sideType === 'BOTH_SIDES' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], background: 'rgba(255,255,255,0.02)', padding: spacing[4], borderRadius: radius.md, border: `1px solid ${colors.border}` }}>
                  <h4 style={{ color: colors.primary }}>Groom Side Details</h4>
                  <FormGroup><label>Name *</label><input type="text" value={clientName2} onChange={e => setClientName2(e.target.value)} required /></FormGroup>
                  <FormGroup><label>Contact Number *</label><input type="tel" value={contact2} onChange={e => setContact2(e.target.value)} required /></FormGroup>
                  <FormGroup><label>Location / City *</label><input type="text" value={location2} onChange={e => setLocation2(e.target.value)} required /></FormGroup>
                </div>
              )}
            </FormGrid>

            <div style={{ marginTop: spacing[4] }}>
              <FormGroup>
                <label>Reference (How did they find us?)</label>
                <input type="text" value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. Instagram, Referral" />
              </FormGroup>
            </div>
          </div>

          {/* SECTION: BUDGET */}
          <div>
            <SectionTitle>Budget Configuration</SectionTitle>
            <FormGrid $cols={3}>
              <FormGroup>
                <label>Base Price (INR)</label>
                <input type="number" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} required />
              </FormGroup>
              <FormGroup>
                <label>Discount (INR)</label>
                <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
              </FormGroup>
              <FormGroup>
                <label>Final Total (INR)</label>
                <input type="text" value={`₹ ${finalPrice.toLocaleString()}`} disabled style={{ fontWeight: 'bold', color: colors.success, background: 'rgba(16, 185, 129, 0.1)', border: 'none' }} />
              </FormGroup>
            </FormGrid>
          </div>

          {/* SECTION: EVENTS */}
          <div>
            <SectionTitle>Events & Dates (Defaults to Today)</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              {EVENT_TYPES.map(ev => {
                const isActive = !!events[ev.id];
                return (
                  <div key={ev.id} style={{ display: 'flex', gap: spacing[4], alignItems: 'center', background: isActive ? 'rgba(212, 175, 55, 0.05)' : colors.surface, padding: spacing[4], border: `1px solid ${isActive ? colors.primary : colors.border}`, borderRadius: radius.md }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: spacing[3], width: '200px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={isActive} onChange={() => toggleEvent(ev.id, !!ev.hasLocation)} style={{ width: '18px', height: '18px' }} />
                      <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? colors.primary : colors.onSurface }}>{ev.label}</span>
                    </label>
                    
                    {isActive && (
                      <div style={{ display: 'flex', gap: spacing[4], flexWrap: 'wrap', flex: 1 }}>
                        <FormGroup style={{ flex: 1 }}>
                          <label>{sideType === 'BOTH_SIDES' ? "Bride Date" : "Date"}</label>
                          <input type="date" value={events[ev.id].date1} onChange={e => updateEvent(ev.id, 'date1', e.target.value)} required style={{ colorScheme: 'dark' }} />
                        </FormGroup>

                        {sideType === 'BOTH_SIDES' && (
                          <FormGroup style={{ flex: 1 }}>
                            <label>Groom Date</label>
                            <input type="date" value={events[ev.id].date2 || todayStr} onChange={e => updateEvent(ev.id, 'date2', e.target.value)} required style={{ colorScheme: 'dark' }} />
                          </FormGroup>
                        )}

                        {ev.hasLocation && (
                          <FormGroup style={{ flex: 1 }}>
                            <label>Specific Location</label>
                            <input type="text" placeholder="e.g. Mayfair" value={events[ev.id].location || ''} onChange={e => updateEvent(ev.id, 'location', e.target.value)} required />
                          </FormGroup>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION: PAYMENTS */}
          <div>
            <SectionTitle>Customizable Payment Milestones</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Advance Payment (Fully Editable) */}
              <PaymentRow>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: colors.onSurface, fontWeight: 600 }}>1st - Advance (Customizable)</span>
                  <span style={{ fontSize: '0.8rem', color: colors.onSurface, opacity: 0.7 }}>Default is 15%. Enter any custom amount.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: colors.primary, fontWeight: 'bold' }}>₹</span>
                  <input 
                    type="number" 
                    placeholder={(finalPrice * 0.15).toString()} 
                    value={customAdvance} 
                    onChange={(e) => setCustomAdvance(e.target.value)}
                    style={{ padding: '8px', width: '120px', borderRadius: radius.sm, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.primary, fontWeight: 'bold' }} 
                  />
                </div>
                <select 
                  value={paymentStatuses.advance} 
                  onChange={e => updatePaymentStatus('advance', e.target.value)}
                  style={{ padding: '8px', borderRadius: radius.sm, background: paymentStatuses.advance === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: paymentStatuses.advance === 'PAID' ? colors.success : colors.onSurface, border: `1px solid ${colors.border}` }}
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
                </select>
              </PaymentRow>

              {/* Dynamic Remaining Milestones */}
              {[
                { key: 'prewed', label: '2nd - Prewedding Day', weight: wPrewed },
                { key: 'eng', label: '3rd - Engagement', weight: wEng },
                { key: 'marriage', label: '4th - Marriage', weight: wMarriage },
                { key: 'reception', label: '5th - Reception/Delivery', weight: wReception },
              ].map((milestone) => (
                <PaymentRow key={milestone.key}>
                  <span style={{ color: colors.onSurface, fontWeight: 600 }}>{milestone.label}</span>
                  <span style={{ color: colors.primary, fontSize: '1.1rem' }}>₹ {Math.round(remainingBalance * milestone.weight).toLocaleString()}</span>
                  <select 
                    value={paymentStatuses[milestone.key as keyof typeof paymentStatuses]} 
                    onChange={e => updatePaymentStatus(milestone.key as keyof typeof paymentStatuses, e.target.value)}
                    style={{ padding: '8px', borderRadius: radius.sm, background: paymentStatuses[milestone.key as keyof typeof paymentStatuses] === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: paymentStatuses[milestone.key as keyof typeof paymentStatuses] === 'PAID' ? colors.success : colors.onSurface, border: `1px solid ${colors.border}` }}
                  >
                    <option value="UNPAID">Unpaid / To be paid</option>
                    <option value="PAID">Paid</option>
                  </select>
                </PaymentRow>
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: spacing[2], color: colors.onSurface, fontSize: '0.9rem' }}>
              Balance Remaining: <strong>₹ {remainingBalance.toLocaleString()}</strong>
            </div>
          </div>

          {/* SECTION: DELIVERABLES */}
          <div>
            <SectionTitle>Deliverables (Editable Defaults)</SectionTitle>
            <FormGrid $cols={2}>
              {/* Photos & Albums */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], padding: spacing[4], border: `1px solid ${colors.border}`, borderRadius: radius.md }}>
                <h4 style={{ color: colors.primary }}>Photography & Albums</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.onSurface }}><input type="checkbox" defaultChecked /> Unlimited Photos Provided</label>
                <FormGrid $cols={2}>
                  <FormGroup><label>Total Edited Photos</label><input type="number" value={deliverables.editedPhotos} onChange={e => updateDeliv('editedPhotos', Number(e.target.value))} /></FormGroup>
                  <FormGroup><label>No. of Albums</label><input type="number" value={deliverables.albumsCount} onChange={e => updateDeliv('albumsCount', Number(e.target.value))} /></FormGroup>
                  <FormGroup>
                    <label>Album Size</label>
                    <select value={deliverables.albumSize} onChange={e => updateDeliv('albumSize', e.target.value)}>
                      <option value="Small">Small</option><option value="Medium">Medium</option><option value="Large">Large</option>
                    </select>
                  </FormGroup>
                  <FormGroup><label>Album Pages</label><input type="number" value={deliverables.albumPages} onChange={e => updateDeliv('albumPages', Number(e.target.value))} /></FormGroup>
                  <FormGroup><label>Photo Frames</label><input type="number" value={deliverables.photoFrames} onChange={e => updateDeliv('photoFrames', Number(e.target.value))} /></FormGroup>
                  <FormGroup><label>Frame Size</label><input type="text" value={deliverables.photoFrameSize} onChange={e => updateDeliv('photoFrameSize', e.target.value)} /></FormGroup>
                </FormGrid>
              </div>

              {/* Videography */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], padding: spacing[4], border: `1px solid ${colors.border}`, borderRadius: radius.md }}>
                <h4 style={{ color: colors.primary }}>Videography & Reels</h4>
                <FormGrid $cols={2}>
                  <FormGroup><label>Traditional Video</label><input type="text" value={deliverables.tradVideoHours} onChange={e => updateDeliv('tradVideoHours', e.target.value)} /></FormGroup>
                  <FormGroup><label>Cinematics</label><input type="text" value={deliverables.cinematics} onChange={e => updateDeliv('cinematics', e.target.value)} /></FormGroup>
                  <FormGroup><label>Teaser</label><input type="number" value={deliverables.teaser} onChange={e => updateDeliv('teaser', Number(e.target.value))} /></FormGroup>
                  <FormGroup><label>Highlight</label><input type="number" value={deliverables.highlight} onChange={e => updateDeliv('highlight', Number(e.target.value))} /></FormGroup>
                  <FormGroup><label>Total Reels</label><input type="number" value={deliverables.reelsCount} onChange={e => updateDeliv('reelsCount', Number(e.target.value))} /></FormGroup>
                </FormGrid>
                
                <h5 style={{ color: colors.onSurface, marginTop: spacing[2], borderBottom: `1px solid ${colors.border}`, paddingBottom: '4px' }}>Pre-Wedding Specifics</h5>
                <FormGrid $cols={2}>
                  <FormGroup><label>Prewed Video</label><input type="text" value={deliverables.prewedVideo} onChange={e => updateDeliv('prewedVideo', e.target.value)} /></FormGroup>
                  <FormGroup><label>Cinematic Reel</label><input type="number" value={deliverables.prewedCinematicReel} onChange={e => updateDeliv('prewedCinematicReel', Number(e.target.value))} /></FormGroup>
                  <FormGroup><label>Save the Date Reel</label><input type="number" value={deliverables.prewedSaveDateReel} onChange={e => updateDeliv('prewedSaveDateReel', Number(e.target.value))} /></FormGroup>
                  <FormGroup><label>Prewed Album</label><input type="text" value={deliverables.prewedAlbum} onChange={e => updateDeliv('prewedAlbum', e.target.value)} /></FormGroup>
                </FormGrid>
              </div>
            </FormGrid>
          </div>

          {/* SUBMIT BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[4], paddingTop: spacing[4], borderTop: `1px solid ${colors.border}` }}>
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Processing & Saving...' : 'Confirm & Save Intake Form'}
            </Button>
          </div>
          
        </FormContainer>
      </Card>
    </Layout>
  );
}
