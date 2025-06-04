import { useEffect, useState } from 'react';
import { useAuthFetch } from './useAuthFetch';

interface BackendResource {
  id: number;
  name: string;
  description: string;
  link?: string;
  owner: string;
}

interface BackendRole {
  id: number;
  name: string;
  description: string;
  resourceId: number;
  resourceName: string;
}

interface InitialValues {
  lastName: string;
  firstName: string;
  middleName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface RoleResponse {
  id?: number;
  name: string;
  description: string;
  resourceName: string;
}

export function useRequestForm(initialValues: InitialValues) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rolesLoading, setRolesLoading] = useState<boolean>(false);
  const [availableSystems, setAvailableSystems] = useState<BackendResource[]>([]);
  const [allRoles, setAllRoles] = useState<BackendRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<BackendRole[]>([]);
  const { fetchWithAuth } = useAuthFetch();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [systemsResponse, rolesResponse] = await Promise.all([
          fetchWithAuth<BackendResource[]>(`${API_BASE_URL}/management/resources`),
          fetchWithAuth<RoleResponse[]>(`${API_BASE_URL}/management/roles`),
        ]);

        const sortedSystems = [...systemsResponse].sort((a, b) => a.name.localeCompare(b.name));

        // Добавляем ID ролям, если их нет в ответе
        const rolesWithIds = rolesResponse.map((role, index: number) => ({
          ...role,
          id: role.id || index + 1, // Используем index как fallback
          resourceId: systemsResponse.find((sys) => sys.name === role.resourceName)?.id || 0,
        }));

        setAvailableSystems(sortedSystems);
        setAllRoles(rolesWithIds);
      } catch (error) {
        console.error('Error fetching initial form data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchWithAuth]);

  const handleSystemChange = async (systemId: number) => {
    try {
      setRolesLoading(true);
      const rolesForSystem = allRoles.filter((role) => role.resourceId === systemId);
      const sortedRoles = [...rolesForSystem].sort((a, b) => a.name.localeCompare(b.name));
      setFilteredRoles(sortedRoles);
    } catch (error) {
      console.error('Error filtering roles:', error);
    } finally {
      setRolesLoading(false);
    }
  };

  return {
    isLoading: isLoading || rolesLoading,
    availableSystems,
    filteredRoles,
    allRoles,
    handleSystemChange,
    initialValues,
  };
}
