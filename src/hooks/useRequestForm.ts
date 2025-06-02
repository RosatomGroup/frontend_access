// src/hooks/useRequestForm.ts
import { useState, useEffect } from 'react';
import { useAuthFetch } from './useAuthFetch';

interface BackendResource {
  id: number;
  name: string;
  description: string;
  link?: string;
}

interface BackendRole {
  id: number;
  name: string;
  description: string;
  resourceId: number;
}

interface InitialValues {
  lastName: string;
  firstName: string;
  middleName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export function useRequestForm(initialValues: InitialValues) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSystems, setAvailableSystems] = useState<BackendResource[]>([]);
  const [allRoles, setAllRoles] = useState<BackendRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<BackendRole[]>([]);
  const { fetchWithAuth } = useAuthFetch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resourcesData, rolesData] = await Promise.all([
          fetchWithAuth(`${API_BASE_URL}/management/resources`),
          fetchWithAuth(`${API_BASE_URL}/management/roles`),
        ]);

        const sortedSystems = [...resourcesData].sort((a, b) => a.name.localeCompare(b.name));
        setAvailableSystems(sortedSystems);
        setAllRoles(rolesData);
      } catch (error) {
        console.error("Error fetching data for request form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchWithAuth]);

  const handleSystemChange = (selectedSystemId: number | string) => {
    const systemId = Number(selectedSystemId);
    const rolesForSelectedSystem = allRoles.filter(
      (role) => role.resourceId === systemId
    );
    const sortedRoles = [...rolesForSelectedSystem].sort((a, b) => a.name.localeCompare(b.name));
    setFilteredRoles(sortedRoles);
  };

  return {
    isLoading,
    availableSystems,
    filteredRoles,
    handleSystemChange,
    initialValues,
  };
}