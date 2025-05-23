
import { useTheme } from '@/context/ThemeContext';
import { Permission } from '@/app/security/page';

type PermissionPillProps = {
    permission: Permission;
};

export const PermissionPill: React.FC<PermissionPillProps> = ({ permission }) => {
    const { theme } = useTheme();

    const getColorClass = () => {
        const name = permission.name.toLowerCase();

        if (name.includes('read')) return theme.SUCCESS;
        if (name.includes('write')) return theme.WARNING;
        if (name.includes('update')) return theme.WARNING;
        if (name.includes('delete')) return theme.ERROR;

        return theme.SIDENAV_BG;
    };

    return (
        <span className={`p-2 m-1 rounded-lg text-sm font-medium`}
            style={{
            backgroundColor: `${getColorClass()}55`,
            color: theme.TEXT
        }}>
            {permission.name}
        </span>
    );
};
