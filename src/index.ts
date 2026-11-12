import "./styles/tokens.css";
import "./styles/base.css";

// Button
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button";

// Inputs & form controls
export {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  FormField,
} from "./components/Input";
export type {
  InputProps,
  TextareaProps,
  SelectProps,
  SelectOption,
  SelectVariant,
  CheckboxProps,
  RadioProps,
  SwitchProps,
  FormFieldProps,
  InputSize,
} from "./components/Input";

// Badge
export { Badge } from "./components/Badge";
export type { BadgeProps, BadgeVariant } from "./components/Badge";
// Tooltip
export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";
// Popover
export { Popover } from "./components/Popover";
export type { PopoverProps } from "./components/Popover";
// DatePicker
export {
  Calendar,
  DateInput,
  TimePicker,
  DateTimeInput,
  getTimeRange,
} from "./components/DatePicker";
export type {
  CalendarProps,
  CalendarView,
  DateInputProps,
  DatePreset,
  TimePickerProps,
  TimePreset,
  DateTimeInputProps,
} from "./components/DatePicker";

// FilterBar
export { FilterBar } from "./components/FilterBar";
export type { FilterBarProps, FilterDefinition, FilterValues } from "./components/FilterBar";

// Card
export { Card, CardHeader, CardBody, CardFooter } from "./components/Card";
export type {
  CardProps,
  CardHeaderProps,
  CardVariant,
  CardPadding,
} from "./components/Card";

// ImageCard
export { ImageCard } from "./components/ImageCard";
export type { ImageCardProps, BadgeConfig } from "./components/ImageCard";

// ImageCarousel
export { ImageCarousel } from "./components/ImageCarousel";
export type { ImageCarouselProps, CarouselSection } from "./components/ImageCarousel";

// ImageGrid
export { ImageGrid } from "./components/ImageGrid";
export type { ImageGridProps } from "./components/ImageGrid";

// Modal
export { Modal } from "./components/Modal";
export type { ModalProps, ModalSize } from "./components/Modal";

// Toast
export { Toast, ToastContainer } from "./components/Toast";
export type {
  ToastProps,
  ToastContainerProps,
  ToastVariant,
  ToastPosition,
} from "./components/Toast";

// MessagePanel (LinkedIn-style messaging dock)
export {
  MessagePanel,
  MessageDock,
  MessageDockBar,
  MessageList,
  MessageBubble,
  MessageDayDivider,
  MessageComposer,
} from "./components/MessagePanel";
export type {
  MessagePanelProps,
  MessageDockProps,
  MessageDockBarProps,
  DockConversation,
  MessageListProps,
  MessageBubbleProps,
  MessageComposerProps,
  Presence,
  AudienciaAutor,
  EstadoConversacion,
  Mensaje,
  EnviarMensajeEntrada,
} from "./components/MessagePanel";

// Table
export { Table } from "./components/Table";
export type {
  TableProps,
  Column,
  SortState,
  SortDirection,
} from "./components/Table";

// Pagination
export { Pagination } from "./components/Pagination";
export type { PaginationProps } from "./components/Pagination";

// Form
export { Form, FormSection, FormRow, FormActions } from "./components/Form";
export type {
  FormProps,
  FormSectionProps,
  FormRowProps,
  FormActionsProps,
} from "./components/Form";

// FilterTable
export { FilterTable } from "./components/FilterTable";
export type { FilterTableProps } from "./components/FilterTable";

// Navbar
export { Navbar, NavbarLink } from "./components/Navbar";
export type { NavbarProps, NavbarLinkProps } from "./components/Navbar";

// Sidebar
export { Sidebar, SidebarGroup, SidebarItem } from "./components/Sidebar";
export type {
  SidebarProps,
  SidebarGroupProps,
  SidebarItemProps,
} from "./components/Sidebar";

// Breadcrumb
export { Breadcrumb } from "./components/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItemData } from "./components/Breadcrumb";

// Layout
export { Stack, Inline, Grid } from "./components/Layout";
export type { StackProps, InlineProps, GridProps, Gap, Align, Justify } from "./components/Layout";

// PageHeader
export { PageHeader } from "./components/PageHeader";
export type { PageHeaderProps } from "./components/PageHeader";

// Section
export { Section } from "./components/Section";
export type { SectionProps } from "./components/Section";

// DescriptionList
export { DescriptionList } from "./components/DescriptionList";
export type { DescriptionListProps, DescriptionListItem } from "./components/DescriptionList";

// Stat
export { Stat } from "./components/Stat";
export type { StatProps, StatTrend, TrendDirection } from "./components/Stat";

// EmptyState
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

// Alert
export { Alert } from "./components/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert";

// Divider
export { Divider } from "./components/Divider";
export type { DividerProps } from "./components/Divider";

// Tabs
export { Tabs, TabList, Tab, TabPanel } from "./components/Tabs";
export type { TabsProps, TabListProps, TabProps, TabPanelProps } from "./components/Tabs";

// Skeleton
export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable } from "./components/Skeleton";
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCardProps,
  SkeletonTableProps,
  SkeletonVariant,
  SkeletonAnimation,
} from "./components/Skeleton";
// Spinner
export { Spinner } from "./components/Spinner";
export type { SpinnerProps, SpinnerSize } from "./components/Spinner";
// ProgressBar
export { ProgressBar } from "./components/ProgressBar";
export type { ProgressBarProps, ProgressBarSize } from "./components/ProgressBar";
// Visor
export { Visor } from "./components/Visor";
export type { VisorProps, Medium } from "./components/Visor";
