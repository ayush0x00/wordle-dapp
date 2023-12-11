import Menu from "@mui/material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import { Switch } from "@mui/material";

function Settings(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = () => {
    props.darkness(!props.dark);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <SettingsIcon
        onClick={handleClick}
        className="text-black dark:text-white"
      />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <FormControlLabel
          className="pl-3.5 text-slate-600"
          control={<Switch onChange={handleChange} />}
          label="Dark mode"
        />
      </Menu>
    </div>
  );
}

export default Settings;
