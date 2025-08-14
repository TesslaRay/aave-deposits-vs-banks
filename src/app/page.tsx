"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface BankData {
  rank: number;
  name: string;
  assets: number;
  isAave?: boolean;
}

export default function Home() {
  const [bankData, setBankData] = useState<BankData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banks')
      .then(response => response.json())
      .then(data => {
        setBankData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bank data:', error);
        setLoading(false);
      });
  }, []);

  const formatAssets = (assets: number) => {
    return `$${(assets / 1000).toFixed(3)} B`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-sans">Loading data onchain and from Federal Reserve...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-white">
      <h1 className="text-5xl font-bold mb-4 text-white font-mono text-center">Aave vs Banks</h1>
      <p className="text-lg mb-8 text-white opacity-80 font-sans text-center">Aave breaks into the top 40 U.S. banks by size.</p>
      
      <div className="w-full max-w-2xl">
        <table className="w-full border-collapse font-sans">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-4 pr-8 text-white opacity-60 font-medium border-r border-white/20">Rank</th>
              <th className="text-left py-4 px-8 text-white opacity-60 font-medium border-r border-white/20">Name</th>
              <th className="text-right py-4 pl-8 text-white opacity-60 font-medium">Deposits</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {bankData.map((bank) => (
              <tr key={bank.rank} className={bank.isAave ? "bg-white/5" : ""}>
                <td className={`py-3 pr-8 border-r border-white/20 ${bank.isAave ? "text-white font-medium" : "text-white opacity-80"}`}>
                  {bank.rank} {bank.isAave && <span className="text-white/50 text-sm font-normal">▲ 3</span>}
                </td>
                
                <td className={`py-3 px-8 border-r border-white/20 ${bank.isAave ? "text-white font-medium flex items-center" : "text-white opacity-80"}`}>
                  {bank.isAave ? (
                    <Image
                      src="/assets/aave-light.png"
                      alt="Aave logo"
                      width={100}
                      height={100}
                      className="inline"
                    />
                  ) : (
                    bank.name
                  )}
                </td>
                <td className={`text-right py-3 pl-8 ${bank.isAave ? "text-white font-medium" : "text-white opacity-80"}`}>
                  {formatAssets(bank.assets)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="mt-8 text-sm text-white opacity-60 font-sans text-center">
        Source: https://www.federalreserve.gov/releases/lbr/current/
      </p>
    </div>
  );
}
