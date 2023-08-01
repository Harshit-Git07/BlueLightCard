export type ModalProps = {
  id: string;
  isVisible: boolean;
  type: ModalTypes;
  onClose: () => void;
  onConfirm: () => void;
};

export enum ModalTypes {
  QuitEligibility = 'QuitEligibility',
}
