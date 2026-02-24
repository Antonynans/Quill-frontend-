export interface Wallet {
  currency: string;
  flag: string;
  balance: string;
  maskedBalance: string;
  kyc: string;
  textColor: string;
  bgColor?: string;
  account: string;
  icon: React.ReactNode;
}

export interface WalletSectionProps {
  wallets: Wallet[];
  showBalance: boolean;
  setShowBalance: (val: boolean) => void;
  showAll: boolean;
}