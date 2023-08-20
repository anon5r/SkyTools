import { ref } from 'vue'
import { Drawer } from 'flowbite'

/** Drawer */
const drawer = ref(null as Drawer | null)

export const getDrawer = (): Drawer | null => drawer.value

export const initDrawer = () => {
  const $taragetDrawer = document.getElementById('drawer-sidebar')
  if ($taragetDrawer !== null) {
    const drawerOptions = {
      placement: 'right',
      bodyScrolling: true,
      backdrop: true,
    }
    drawer.value = new Drawer($taragetDrawer, drawerOptions)
  }
}

export default {
  getDrawer,
  initDrawer,
}
