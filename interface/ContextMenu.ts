import { MenuItemType } from 'antd/lib/menu/hooks/useItems'

export interface CustomMenuItem extends MenuItemType {
  disabled?: boolean
  onClick: (record: any) => void
}
