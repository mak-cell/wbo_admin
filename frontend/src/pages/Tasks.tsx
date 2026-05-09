import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Layout from "../components/Layout";
import { Card, CardTitle, CardContent } from "../components/Card";
import { colors, spacing, radius } from "../styles/designTokens";
import { ApiService } from "../services/apiService";
import { TaskAssignment, ProjectStatus } from "../types";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  margin-bottom: ${spacing[8]};
  animation: ${fadeIn} 0.5s ease;

  h1 {
    font-size: 2.5rem;
    margin-bottom: ${spacing[2]};
    color: ${colors.primary};
  }
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
  animation: ${fadeIn} 0.5s ease 0.2s both;
`;

const TaskCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TaskInfo = styled.div`
  flex: 1;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const StatusSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background-color: rgba(255, 255, 255, 0.03);
  color: ${colors.onSurface};
  font-family: "Manrope", sans-serif;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, get this from auth context
  const workerId = 1;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await ApiService.getWorkerTasks(workerId);
        setTasks(data);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (
    taskId: number,
    newStatus: string
  ) => {
    try {
      await ApiService.patch(`/worker/tasks/${taskId}`, {
        status: newStatus,
      });
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus as ProjectStatus } : t))
      );
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  if (loading) return <Layout><div style={{ color: colors.onSurface }}>Loading...</div></Layout>;
  if (error) return <Layout><div style={{ color: colors.danger }}>{error}</div></Layout>;

  return (
    <Layout>
      <PageHeader>
        <h1>My Tasks</h1>
      </PageHeader>

      <TasksList>
        {tasks.length === 0 ? (
          <Card>
            <CardTitle>No Tasks Assigned</CardTitle>
            <CardContent>
              You don't have any tasks assigned at the moment.
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id}>
              <TaskInfo>
                <CardTitle>{task.task_description}</CardTitle>
                <CardContent>
                  <p>
                    <strong>Project ID:</strong> {task.project_id}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {task.status}
                  </p>
                </CardContent>

                <TaskActions>
                  <StatusSelect
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                  >
                    <option value={ProjectStatus.PENDING}>Pending</option>
                    <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                    <option value={ProjectStatus.REVIEW}>Review</option>
                    <option value={ProjectStatus.DELIVERED}>Delivered</option>
                    <option value={ProjectStatus.COMPLETED}>Completed</option>
                  </StatusSelect>
                </TaskActions>
              </TaskInfo>
            </TaskCard>
          ))
        )}
      </TasksList>
    </Layout>
  );
};

export default Tasks;
