import { Menu } from "@/domain/Menu";
import { MenuOption } from "naive-ui";
import { h } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "@/components";

export const mapping = (items: Menu[]): MenuOption[] => items.map(item => ({
  ...item,
  key: item.id,
  label: item.name != null ? () => h(RouterLink, {to: item}, {default: () => item.label}) : item.label,
  icon: item.icon != null ? () => h(Icon, {type: item.icon}) : undefined,
  children: item.children && mapping(item.children)
}))

export const defaultMenus = [{
  id: 'dashboard',
  name: 'dashboard',
  label: 'Dashboard',
  icon: 'Home'
}, {
  id: 'profile',
  name: 'profile',
  label: 'Profile',
  icon: 'UserAlt'
}]
