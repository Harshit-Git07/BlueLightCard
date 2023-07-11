export type ModalProps = {
  isVisible: boolean;
  type: ModalTypes;
  onClose: () => void;
  onConfirm: () => void;
};

export enum ModalTypes {
  QuitEligibility = 'QuitEligibility',
}
