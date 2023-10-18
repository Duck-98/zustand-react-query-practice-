import React from 'react';
import { FiFilter } from 'react-icons/fi';

interface DomainCheckBoxProps {
  handleCheckboxChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setSelectedDomains: React.Dispatch<React.SetStateAction<string[]>>,
    queryParam: string,
  ) => void;
  selectedDomains: string[];
  setSelectedDomains: React.Dispatch<React.SetStateAction<string[]>>;
  domains: string[];
  label: string;
  queryParam: string;
}

export const DomainCheckBox = ({
  handleCheckboxChange,
  selectedDomains,
  setSelectedDomains,
  domains,
  label,
  queryParam,
}: DomainCheckBoxProps) => {
  return (
    <div>
      <label className="inline-flex items-center">
        {label} <FiFilter />
      </label>
      {domains.map((domain: string) => (
        <div key={domain} className="space-x-2">
          <input
            type="checkbox"
            value={domain}
            checked={selectedDomains.includes(domain)}
            onChange={(e) => handleCheckboxChange(e, setSelectedDomains, queryParam)}
          />
          <label className="text-lg">{domain}</label>
        </div>
      ))}
    </div>
  );
};
