import React from 'react';

interface DomainCheckBoxProps {
  handleCheckboxChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setSelectedDomains: React.Dispatch<React.SetStateAction<string[]>>,
    queryParam: string,
  ) => void;
  selectedDomains: string[];
  setSelectedDomains: React.Dispatch<React.SetStateAction<any>>;
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
      <label>{label}</label>
      {domains.map((domain: string) => (
        <div key={domain}>
          <input
            type="checkbox"
            value={domain}
            checked={selectedDomains.includes(domain)}
            onChange={(e) => handleCheckboxChange(e, setSelectedDomains, queryParam)}
          />
          <label>{domain}</label>
        </div>
      ))}
    </div>
  );
};
