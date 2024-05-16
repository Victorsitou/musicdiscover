import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack"
import SvgIcon from "@mui/material/SvgIcon"

interface IconMenuItemProps {
    text: string
    icon: JSX.Element
}

export default function MenuIcon(props: IconMenuItemProps) {
    return (
        <Stack direction="row" spacing={2}>
            <SvgIcon>{props.icon}</SvgIcon>
            <ListItemText primary={props.text} />
        </Stack>
    )
}