
import { useTheme } from '@/context/ThemeContext';
import { type Role } from './RolesView';

type RolePillProps = {
    role: Role;
};

export const RolePill: React.FC<RolePillProps> = ({ role }) => {
    const { theme } = useTheme();

    return (
        <span className={`p-2 m-1 rounded-lg text-inherit`}
            style={{
                backgroundColor: `${theme.PRIMARY}55`,
                color: theme.TEXT
            }}>
            {role.name}
        </span>
    );
};
