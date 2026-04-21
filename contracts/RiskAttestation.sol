// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RiskAttestation {
    struct Attestation {
        address tokenAddress;
        uint8 riskScore;
        string verdict;
        uint256 timestamp;
        address attestedBy;
    }

    mapping(address => Attestation) public attestations;
    address[] public attestedTokens;
    
    event RiskAttested(
        address indexed tokenAddress,
        uint8 riskScore,
        string verdict,
        uint256 timestamp
    );

    function attest(
        address tokenAddress,
        uint8 riskScore,
        string calldata verdict
    ) external {
        attestations[tokenAddress] = Attestation({
            tokenAddress: tokenAddress,
            riskScore: riskScore,
            verdict: verdict,
            timestamp: block.timestamp,
            attestedBy: msg.sender
        });
        
        attestedTokens.push(tokenAddress);
        
        emit RiskAttested(tokenAddress, riskScore, verdict, block.timestamp);
    }

    function getAttestation(address tokenAddress) 
        external view returns (Attestation memory) {
        return attestations[tokenAddress];
    }

    function getTotalAttestations() external view returns (uint256) {
        return attestedTokens.length;
    }
}
