export type FavoriteButtonProps = {
  onFavouriteClick: () => void;
  curFavBtnState: 'favourite' | 'unfavourite' | 'disabled' | 'error';
};
