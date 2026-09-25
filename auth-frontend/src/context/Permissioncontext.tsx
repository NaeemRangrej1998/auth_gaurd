import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUserRoleAccess } from "../service/login.api";
import { Loader } from "../components/Loader";

type AccessTypes = {
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
};

interface PermissionContextType {
    hasRouteAccess: (moduleName: string, action: keyof AccessTypes) => boolean;
    isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType>({
    hasRouteAccess: () => false,
    isLoading: true,
});

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            getUserRoleAccess()
                .then((response: any) => {
                    if (response?.code === 200) {
                        // Based on your backend, permissions are inside response.data
                        const fetchedPermissions = response.data?.permissions || [];
                        setPermissions(fetchedPermissions);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user role access", error);
                })
                .finally(() => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 300);
                });
        }, 400);
        return () => clearTimeout(timeOut);
    }, []);

    const hasRouteAccess = (moduleName: string, action: keyof AccessTypes): boolean => {
        if (isLoading) return false;
        const isSuperAdmin = false;

        // Find permission for the given module
        const perm = permissions.find((p) => p.moduleName === moduleName || p.module?.moduleName === moduleName);

        if (!perm) return isSuperAdmin;

        try {
            // Your backend returns accessTypes as a JSON string
            const accessTypes: AccessTypes = typeof perm.accessTypes === 'string'
                ? JSON.parse(perm.accessTypes)
                : perm.accessTypes;

            return accessTypes[action] || isSuperAdmin;
        } catch (error) {
            console.error("Error parsing access types:", error);
            return isSuperAdmin;
        }
    };

    return (
        <PermissionContext.Provider value={{ hasRouteAccess, isLoading }}>
            {isLoading ? <Loader /> : children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => useContext(PermissionContext);