import { addIcons } from '@siemens/ix-icons';
import {
  iconApps,
  iconArrowLeft,
  iconArrowRight,
  iconBuildingBlock,
  iconBulb,
  iconCheck,
  iconChevronRight,
  iconCircleDot,
  iconCode,
  iconCogwheel,
  iconCopy,
  iconDuplicate,
  iconHome,
  iconInfo,
  iconLayers,
  iconMinus,
  iconPlus,
  iconRocket,
} from '@siemens/ix-icons/icons';

/**
 * `<ix-icon name="...">` only renders icons that have been registered. We
 * register the whole app's icon set once at startup so any name used in a
 * template or in content data (category/topic icons) just works.
 */
export function registerAppIcons(): void {
  addIcons({
    iconApps,
    iconArrowLeft,
    iconArrowRight,
    iconBuildingBlock,
    iconBulb,
    iconCheck,
    iconChevronRight,
    iconCircleDot,
    iconCode,
    iconCogwheel,
    iconCopy,
    iconDuplicate,
    iconHome,
    iconInfo,
    iconLayers,
    iconMinus,
    iconPlus,
    iconRocket,
  });
}
