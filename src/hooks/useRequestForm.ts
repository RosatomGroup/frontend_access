import {useEffect, useState} from 'react';
import {api} from "@/api/axios.config";

interface Resource {
    id: number;
    name: string;
    description: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    resourceId: number;
}

interface InitialValues {
    lastName: string;
    firstName: string;
    middleName?: string;
    email: string;
}

export function useRequestForm(initialValues: InitialValues) {
    const [isLoading, setIsLoading] = useState(false);
    const [resources, setResources] = useState<Resource[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [resourcesRes, rolesRes] = await Promise.all([
                    api.get('/requests/resources'),
                    api.get('/requests/roles'),
                ]);

                setResources(resourcesRes.data);
                setRoles(rolesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleResourceChange = (resourceId: number) => {
        const rolesForResource = roles.filter(role => role.resourceId === resourceId);
        setFilteredRoles(rolesForResource);
    };

    return {
        isLoading,
        resources,
        filteredRoles,
        handleResourceChange,
        initialValues
    };
}