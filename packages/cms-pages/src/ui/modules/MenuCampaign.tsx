export default function MenuCampaign({
  menuCampaign,
}: Partial<{
  menuCampaign: Sanity.MenuCampaign;
}>) {
  if (menuCampaign == null) return null;
  return 'Campaign menu';
}
