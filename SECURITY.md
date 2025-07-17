# Security Policy

## Supported Versions

We actively support the following versions of ChainBet:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The ChainBet team takes security seriously. If you discover a security vulnerability, please report it responsibly.

### Reporting Process

1. **Do not create a public GitHub issue** for security vulnerabilities
2. **Email us directly** at security@chainbet.com with the details
3. **Include the following information**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### What to Expect

- **Acknowledgment**: We will acknowledge your report within 24 hours
- **Initial Response**: We will provide an initial response within 72 hours
- **Regular Updates**: We will keep you informed of our progress
- **Resolution**: We aim to resolve critical issues within 7 days
- **Disclosure**: We will coordinate with you on public disclosure timing

### Bug Bounty Program

While we don't currently have a formal bug bounty program, we recognize security researchers who help us improve ChainBet's security:

- **Hall of Fame**: Recognition in our security acknowledgments
- **Swag**: ChainBet merchandise for valid reports
- **Direct Communication**: Direct line to our security team

### Security Best Practices

When working with ChainBet:

#### For Developers
- Keep dependencies updated
- Use environment variables for sensitive data
- Follow secure coding practices
- Run security scans regularly
- Use proper authentication and authorization

#### For Users
- Use strong, unique passwords
- Enable two-factor authentication
- Keep your wallet software updated
- Be cautious of phishing attempts
- Report suspicious activity

#### For Deployments
- Use HTTPS for all communications
- Implement proper access controls
- Monitor for unusual activity
- Keep systems patched and updated
- Use secure configuration management

### Common Security Considerations

#### Smart Contract Security
- All contracts undergo thorough auditing
- Use established security patterns
- Implement proper access controls
- Test extensively before deployment
- Monitor for unusual transactions

#### API Security
- Implement rate limiting
- Use proper authentication
- Validate all inputs
- Sanitize outputs
- Log security events

#### Database Security
- Use parameterized queries
- Implement proper access controls
- Encrypt sensitive data
- Regular security audits
- Backup encryption

#### Infrastructure Security
- Use secure networking
- Implement monitoring
- Regular security updates
- Access logging
- Incident response procedures

### Vulnerability Categories

We classify vulnerabilities based on severity:

#### Critical
- Remote code execution
- SQL injection
- Authentication bypass
- Private key exposure
- Smart contract vulnerabilities

#### High
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Information disclosure
- Privilege escalation
- Denial of service

#### Medium
- Security misconfigurations
- Information leakage
- Weak cryptography
- Session management issues

#### Low
- Security headers missing
- Information disclosure (limited)
- Minor security misconfigurations

### Response Timeline

- **Critical**: 24 hours
- **High**: 72 hours
- **Medium**: 1 week
- **Low**: 2 weeks

### Contact Information

- **Security Team**: security@chainbet.com
- **GPG Key**: [Available on our website]
- **Security Page**: https://chainbet.com/security

### Legal

- We will not pursue legal action against security researchers who report vulnerabilities in good faith
- We ask that you do not access user data or disrupt our services
- We reserve the right to involve law enforcement for malicious activities

### Acknowledgments

We thank the following security researchers for their contributions:

- [To be updated with contributor names]

---

*This security policy is subject to change. Please check back regularly for updates.*
