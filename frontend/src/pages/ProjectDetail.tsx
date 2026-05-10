import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Layout from "../components/Layout";
import { Card, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { colors, spacing, radius } from "../styles/designTokens";
import { ApiService } from "../services/apiService";
import { Project, ProjectStatus, Payment, Deliverable, TaskAssignment } from "../types";

interface UserRecord {
  id: number;
  name: string;
  role: string;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;
  h1 { font-size: 2.5rem; margin-bottom: ${spacing[2]}; color: ${colors.primary}; }
`;

const Form = styled.form`
  display: grid;
  gap: ${spacing[6]};
  animation: ${fadeIn} 0.5s ease 0.2s both;
`;

const Section = styled(Card)``;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${spacing[4]};
  color: ${colors.primary};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.onBackground};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${spacing[2]};
`;

const Input = styled.input`
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${colors.onBackground};
  font-size: 1rem;
  transition: all 0.2s ease;
  &:focus { outline: none; border-color: ${colors.primary}; }
`;

const Select = styled.select`
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${colors.onBackground};
  font-size: 1rem;
  &:focus { outline: none; border-color: ${colors.primary}; }
  option { background: ${colors.surface}; }
`;

const Badge = styled.span<{ status?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ status }) =>
    status === "Past" ? 'rgba(239, 68, 68, 0.1)' :
    status === "Today" ? 'rgba(212, 175, 55, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  color: ${({ status }) => (
    status === "Past" ? colors.danger : status === "Today" ? colors.primary : colors.info
  )};
`;

const ListSection = styled.div`
  display: grid;
  gap: ${spacing[4]};
`;

const MiniCard = styled.div`
  padding: ${spacing[4]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${radius.md};
  border-left: 2px solid ${colors.primary};
`;

const LinkBack = styled(Link)`
  display: inline-block;
  margin-bottom: ${spacing[4]};
  color: ${colors.primaryHover};
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: ${colors.danger};
  margin-top: ${spacing[4]};
`;

/* --- Deliverable Task Card Styles --- */
const DeliverableCard = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  padding: ${spacing[4]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${radius.md};
  border-left: 4px solid ${({ $status }) => {
    switch ($status) {
      case "Completed":
      case "Delivered": return colors.success;
      case "In Progress": return colors.info;
      case "Review": return '#c084fc';
      default: return colors.warning;
    }
  }};
  transition: all 0.2s ease;
`;

const DelivInfo = styled.div`
  flex: 1;
  .category { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: ${colors.onSurface}; opacity: 0.7; }
  .desc { font-weight: 600; color: ${colors.onBackground}; margin-top: 2px; }
`;

const DelivStatusSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: rgba(255, 255, 255, 0.03);
  color: ${colors.onSurface};
  font-size: 0.85rem;
  &:focus { outline: none; border-color: ${colors.primary}; }
  option { background: ${colors.surface}; }
`;

const DelivDateInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: rgba(255, 255, 255, 0.03);
  color: ${colors.onBackground};
  font-size: 0.85rem;
  color-scheme: dark;
  &:focus { outline: none; border-color: ${colors.primary}; }
`;

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Crew assignment state
  const [workers, setWorkers] = useState<UserRecord[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!projectId) return;
        const [data, usersData, assignData] = await Promise.all([
          ApiService.getProject(Number(projectId)),
          ApiService.getUsers(),
          ApiService.getProjectAssignments(Number(projectId)),
        ]);
        setProject(data as Project);
        setWorkers(usersData);
        setAssignments(assignData);
      } catch (err) {
        setError("Unable to load project details.");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  const formatEventStatus = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate.getTime() === today.getTime()) return "Today";
    return eventDate < today ? "Past" : "Upcoming";
  };

  const handleProjectFieldChange = (field: keyof Project, value: string | number) => {
    if (!project) return;
    setProject({ ...project, [field]: value } as Project);
  };

  const handleEventChange = (index: number, field: "event_type" | "event_date", value: string) => {
    if (!project) return;
    const updated = [...project.events];
    updated[index] = { ...updated[index], [field]: value };
    setProject({ ...project, events: updated });
  };

  const handleDeliverableChange = (index: number, field: keyof Deliverable, value: string) => {
    if (!project) return;
    const updated = [...project.deliverables];
    updated[index] = { ...updated[index], [field]: value } as Deliverable;
    setProject({ ...project, deliverables: updated });
  };

  const handlePaymentChange = (index: number, field: keyof Payment, value: string | number | boolean) => {
    if (!project) return;
    const updated = [...project.payments];
    updated[index] = { ...updated[index], [field]: value } as Payment;
    setProject({ ...project, payments: updated });
  };

  const addEvent = () => {
    if (!project) return;
    setProject({ ...project, events: [...project.events, { id: undefined as any, project_id: project.id, event_type: "", event_date: "" } as any] });
  };

  const addDeliverable = () => {
    if (!project) return;
    setProject({ ...project, deliverables: [...project.deliverables, { id: undefined as any, project_id: project.id, category: "Photography", description: "", status: ProjectStatus.PENDING } as any] });
  };

  const addPayment = () => {
    if (!project) return;
    setProject({ ...project, payments: [...project.payments, { id: undefined as any, project_id: project.id, milestone: "", amount: 0, is_paid: false }] });
  };

  const removeEvent = (i: number) => { if (!project) return; setProject({ ...project, events: project.events.filter((_, idx) => idx !== i) }); };
  const removeDeliverable = (i: number) => { if (!project) return; setProject({ ...project, deliverables: project.deliverables.filter((_, idx) => idx !== i) }); };
  const removePayment = (i: number) => { if (!project) return; setProject({ ...project, payments: project.payments.filter((_, idx) => idx !== i) }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        client_name: project.client_name,
        event_title: project.event_title,
        instagram_reference: project.instagram_reference,
        location: project.location,
        contact_number: project.contact_number,
        total_budget: project.total_budget,
        status: project.status,
        events: project.events.map(e => ({ id: e.id, event_type: e.event_type, event_date: e.event_date })),
        deliverables: project.deliverables.map(d => ({
          id: d.id,
          category: d.category,
          description: d.description,
          details: d.details,
          status: d.status,
          due_date: d.due_date || null,
        })),
        payments: project.payments.map(p => ({ id: p.id, milestone: p.milestone, amount: p.amount, is_paid: p.is_paid })),
      };

      await ApiService.updateProject(project.id, payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div style={{ color: colors.onSurface }}>Loading project...</div></Layout>;
  if (!project) return <Layout><div style={{ color: colors.danger }}>Project not found.</div></Layout>;

  // Group deliverables by category for display
  const delivCategories = Array.from(new Set(project.deliverables.map(d => d.category)));

  return (
    <Layout>
      <LinkBack to="/projects">← Back to Projects</LinkBack>
      <PageHeader><h1>Edit Project</h1></PageHeader>

      <Form onSubmit={handleSubmit}>
        {/* OVERVIEW */}
        <Section>
          <SectionTitle>Project Overview</SectionTitle>
          <FormGrid>
            <FormGroup><Label>Client Name</Label><Input type="text" value={project.client_name} onChange={e => handleProjectFieldChange("client_name", e.target.value)} required /></FormGroup>
            <FormGroup><Label>Event Title</Label><Input type="text" value={project.event_title || ""} onChange={e => handleProjectFieldChange("event_title", e.target.value)} /></FormGroup>
            <FormGroup><Label>Instagram</Label><Input type="text" value={project.instagram_reference || ""} onChange={e => handleProjectFieldChange("instagram_reference", e.target.value)} /></FormGroup>
            <FormGroup><Label>Location</Label><Input type="text" value={project.location} onChange={e => handleProjectFieldChange("location", e.target.value)} required /></FormGroup>
            <FormGroup><Label>Contact</Label><Input type="text" value={project.contact_number} onChange={e => handleProjectFieldChange("contact_number", e.target.value)} required /></FormGroup>
            <FormGroup><Label>Budget (₹)</Label><Input type="number" value={project.total_budget} onChange={e => handleProjectFieldChange("total_budget", Number(e.target.value))} required /></FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select value={project.status} onChange={e => handleProjectFieldChange("status", e.target.value)}>
                <option value={ProjectStatus.PENDING}>Pending</option>
                <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                <option value={ProjectStatus.REVIEW}>Review</option>
                <option value={ProjectStatus.DELIVERED}>Delivered</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Section>

        {/* EVENTS + CREW ASSIGNMENTS */}
        <Section>
          <SectionTitle>Calendar / Events & Crew</SectionTitle>
          <p style={{ color: colors.onSurface, marginBottom: spacing[4], fontSize: '0.85rem', opacity: 0.7 }}>
            Assign team members to each event. Assignments show on the Studio Calendar.
          </p>
          <ListSection>
            {project.events.map((event, index) => {
              const eventAssignments = assignments.filter(a => a.event_id === event.id);
              const assignedWorkerIds = new Set(eventAssignments.map(a => a.worker_id));
              const availableWorkers = workers.filter(w => !assignedWorkerIds.has(w.id));

              const handleAssignWorker = async (workerId: number) => {
                if (!project) return;
                try {
                  const worker = workers.find(w => w.id === workerId);
                  const result = await ApiService.createTaskAssignment({
                    worker_id: workerId,
                    project_id: project.id,
                    event_id: event.id,
                    task_description: `${event.event_type} - ${worker?.name || 'Worker'}`,
                  });
                  setAssignments([...assignments, result]);
                } catch (err) {
                  console.error('Failed to assign worker:', err);
                }
              };

              const handleRemoveAssignment = async (taskId: number) => {
                try {
                  await ApiService.deleteTaskAssignment(taskId);
                  setAssignments(assignments.filter(a => a.id !== taskId));
                } catch (err) {
                  console.error('Failed to remove assignment:', err);
                }
              };

              return (
                <MiniCard key={index}>
                  <CardTitle style={{ fontSize: '1.2rem', marginBottom: spacing[2] }}>{event.event_type || `Event ${index + 1}`}</CardTitle>
                  <FormGrid>
                    <FormGroup><Label>Event Type</Label><Input value={event.event_type} onChange={e => handleEventChange(index, "event_type", e.target.value)} required /></FormGroup>
                    <FormGroup><Label>Event Date</Label><Input type="date" value={event.event_date} onChange={e => handleEventChange(index, "event_date", e.target.value)} required /></FormGroup>
                    <FormGroup><Label>Status</Label><div><Badge status={formatEventStatus(event.event_date)}>{formatEventStatus(event.event_date)}</Badge></div></FormGroup>
                  </FormGrid>

                  {/* Crew Assignment for this event */}
                  {event.id && (
                    <div style={{ marginTop: spacing[4], padding: spacing[3], background: 'rgba(0,0,0,0.2)', borderRadius: radius.md }}>
                      <Label style={{ marginBottom: spacing[2] }}>Assigned Crew ({eventAssignments.length})</Label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[3] }}>
                        {eventAssignments.length === 0 && (
                          <span style={{ fontSize: '0.8rem', color: colors.onSurface, opacity: 0.5 }}>No crew assigned yet</span>
                        )}
                        {eventAssignments.map(a => {
                          const worker = workers.find(w => w.id === a.worker_id);
                          return (
                            <span key={a.id} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                              background: 'rgba(212, 175, 55, 0.15)', color: colors.primary
                            }}>
                              {worker?.name || `Worker #${a.worker_id}`}
                              <span
                                onClick={() => handleRemoveAssignment(a.id)}
                                style={{ cursor: 'pointer', color: colors.danger, fontWeight: 700, fontSize: '0.7rem' }}
                                title="Remove"
                              >✕</span>
                            </span>
                          );
                        })}
                      </div>
                      {availableWorkers.length > 0 && (
                        <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
                          <Select
                            id={`assign-worker-${index}`}
                            defaultValue=""
                            onChange={e => { if (e.target.value) { handleAssignWorker(Number(e.target.value)); e.target.value = ''; } }}
                            style={{ flex: 1, fontSize: '0.85rem', padding: '6px 10px' }}
                          >
                            <option value="" disabled>+ Assign a team member...</option>
                            {availableWorkers.map(w => (
                              <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
                            ))}
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="button" variant="danger" onClick={() => removeEvent(index)} style={{ marginTop: spacing[4] }}>Remove</Button>
                </MiniCard>
              );
            })}
            <Button type="button" variant="outline" onClick={addEvent} style={{ width: 'fit-content' }}>+ Add Event</Button>
          </ListSection>
        </Section>

        {/* DELIVERABLES as TASK CARDS */}
        <Section>
          <SectionTitle>Deliverables — Task Tracker</SectionTitle>
          <p style={{ color: colors.onSurface, marginBottom: spacing[4], fontSize: '0.85rem', opacity: 0.7 }}>
            Track each deliverable as a task. Set due dates to show them on the Studio Calendar.
          </p>

          {delivCategories.length === 0 && project.deliverables.length === 0 && (
            <div style={{ color: colors.onSurface, opacity: 0.5, padding: spacing[4] }}>No deliverables yet.</div>
          )}

          {delivCategories.map(cat => (
            <div key={cat} style={{ marginBottom: spacing[6] }}>
              <h4 style={{ color: colors.primary, marginBottom: spacing[3], fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{cat}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                {project.deliverables.map((d, idx) => {
                  if (d.category !== cat) return null;

                  const delivAssignments = d.id ? assignments.filter(a => a.deliverable_id === d.id) : [];
                  const assignedIds = new Set(delivAssignments.map(a => a.worker_id));
                  const available = workers.filter(w => !assignedIds.has(w.id));

                  const assignToDeliv = async (workerId: number) => {
                    if (!project) return;
                    try {
                      const w = workers.find(x => x.id === workerId);
                      const result = await ApiService.createTaskAssignment({
                        worker_id: workerId,
                        project_id: project.id,
                        deliverable_id: d.id,
                        task_description: `${d.description || d.category} - ${w?.name || 'Worker'}`,
                      });
                      setAssignments([...assignments, result]);
                    } catch (err) { console.error(err); }
                  };

                  const removeFromDeliv = async (taskId: number) => {
                    try {
                      await ApiService.deleteTaskAssignment(taskId);
                      setAssignments(assignments.filter(a => a.id !== taskId));
                    } catch (err) { console.error(err); }
                  };

                  return (
                    <div key={idx} style={{ marginBottom: spacing[2] }}>
                      <DeliverableCard $status={d.status}>
                        <DelivInfo>
                          <div className="category">{d.category}</div>
                          <input
                            className="desc"
                            value={d.description || ""}
                            onChange={e => handleDeliverableChange(idx, "description", e.target.value)}
                            placeholder="Deliverable description"
                            style={{ background: 'transparent', border: 'none', color: colors.onBackground, fontWeight: 600, fontSize: '0.95rem', width: '100%', outline: 'none' }}
                          />
                        </DelivInfo>
                        <DelivDateInput
                          type="date"
                          value={d.due_date || ""}
                          onChange={e => handleDeliverableChange(idx, "due_date", e.target.value)}
                          title="Due date (shows on calendar)"
                        />
                        <DelivStatusSelect
                          value={d.status}
                          onChange={e => handleDeliverableChange(idx, "status", e.target.value)}
                        >
                          <option value={ProjectStatus.PENDING}>Pending</option>
                          <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                          <option value={ProjectStatus.REVIEW}>Review</option>
                          <option value={ProjectStatus.DELIVERED}>Delivered</option>
                          <option value={ProjectStatus.COMPLETED}>Completed</option>
                        </DelivStatusSelect>
                        <Button type="button" variant="danger" onClick={() => removeDeliverable(idx)} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>✕</Button>
                      </DeliverableCard>

                      {/* Crew Assignment for this deliverable */}
                      {d.id && (
                        <div style={{ marginLeft: '16px', padding: `${spacing[2]} ${spacing[3]}`, background: 'rgba(0,0,0,0.15)', borderRadius: `0 0 ${radius.md} ${radius.md}`, borderLeft: `2px solid rgba(255,255,255,0.05)` }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2], alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: colors.onSurface, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned:</span>
                            {delivAssignments.map(a => {
                              const w = workers.find(x => x.id === a.worker_id);
                              return (
                                <span key={a.id} style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                  background: 'rgba(59, 130, 246, 0.15)', color: colors.info
                                }}>
                                  {w?.name || `#${a.worker_id}`}
                                  <span onClick={() => removeFromDeliv(a.id)} style={{ cursor: 'pointer', color: colors.danger, fontSize: '0.65rem' }}>✕</span>
                                </span>
                              );
                            })}
                            {available.length > 0 && (
                              <select
                                defaultValue=""
                                onChange={e => { if (e.target.value) { assignToDeliv(Number(e.target.value)); e.target.value = ''; } }}
                                style={{ padding: '2px 6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', border: `1px solid ${colors.border}`, borderRadius: radius.sm, color: colors.onSurface }}
                              >
                                <option value="" disabled>+ Assign...</option>
                                {available.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                              </select>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addDeliverable} style={{ width: 'fit-content' }}>+ Add Deliverable</Button>
        </Section>

        {/* PAYMENTS */}
        <Section>
          <SectionTitle>Payment Schedule</SectionTitle>
          <ListSection>
            {project.payments.map((payment, index) => (
              <MiniCard key={index}>
                <FormGrid>
                  <FormGroup><Label>Milestone</Label><Input value={payment.milestone} onChange={e => handlePaymentChange(index, "milestone", e.target.value)} required /></FormGroup>
                  <FormGroup><Label>Amount</Label><Input type="number" value={payment.amount} onChange={e => handlePaymentChange(index, "amount", Number(e.target.value))} required /></FormGroup>
                  <FormGroup>
                    <Label>Paid</Label>
                    <Select value={payment.is_paid ? "true" : "false"} onChange={e => handlePaymentChange(index, "is_paid", e.target.value === "true")}>
                      <option value="false">Pending</option>
                      <option value="true">Paid</option>
                    </Select>
                  </FormGroup>
                </FormGrid>
                <Button type="button" variant="danger" onClick={() => removePayment(index)} style={{ marginTop: spacing[4] }}>Remove</Button>
              </MiniCard>
            ))}
            <Button type="button" variant="outline" onClick={addPayment} style={{ width: 'fit-content' }}>+ Add Payment</Button>
          </ListSection>
        </Section>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <Badge status="Today" style={{ marginBottom: spacing[4] }}>Project updated successfully</Badge>}

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving changes..." : "Save Project"}
        </Button>
      </Form>
    </Layout>
  );
};

export default ProjectDetail;
