import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems(props) {
  return (
    <Menu
      theme="light"
      mode="horizontal"
      selectable={false}
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "right",
        maxWidth: "500px",
      }}
    >
      <Menu.Item key="/">
        <NavLink to="/">Home</NavLink>
      </Menu.Item>
      {props.isLogged && <>
        <Menu.Item key="/2">
          <NavLink to="/2">Contact Page</NavLink>
        </Menu.Item>
        </>
      }
      {!props.isLogged && <>
        <Menu.Item key="/connect">
          Sign in
        </Menu.Item>
        </>
      }
    </Menu>
  );
}

export default MenuItems;
