import { useState, useEffect } from 'react';
import rolesData from '@/app/roles.json';

interface RoleItem {
  description: string;
  applicationName: string;
}

interface RolesData {
  items: RoleItem[];
}

interface InitialValues {
  lastName: string;
  firstName: string;
  middleName?: string;
}

export function useRequestForm(initialValues: InitialValues) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSystems, setAvailableSystems] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<RoleItem[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const typedRolesData = rolesData as RolesData;
    const roleItems = typedRolesData?.items || [];

    const systemsArray = Array.from(new Set(roleItems.map(item => item.applicationName)));
    const uniqueSystems = systemsArray.sort((firstSystem: string, secondSystem: string) => 
      firstSystem.localeCompare(secondSystem)
    );

    setAvailableSystems(uniqueSystems);
    setAllRoles(roleItems);
    setIsLoading(false);
  }, []);

  const handleSystemChange = (selectedSystem: string) => {
    const rolesForSelectedSystem = allRoles.filter(
      role => role.applicationName === selectedSystem
    );
    setFilteredRoles(rolesForSelectedSystem);
  };

  return {
    isLoading,
    availableSystems,
    filteredRoles,
    handleSystemChange,
    initialValues // Добавляем начальные значения в возвращаемый объект
  };
}