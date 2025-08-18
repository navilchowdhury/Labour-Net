import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Professional corporate color scheme
  const colors = {
    primary: '#2c5aa0',
    secondary: '#1a202c',
    accent: '#3182ce',
    success: '#38a169',
    warning: '#d69e2e',
    danger: '#e53e3e',
    light: '#f7fafc',
    dark: '#1a202c',
    gray: '#4a5568',
    lightGray: '#e2e8f0',
    white: '#ffffff'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: colors.white
    }}>
      {/* Hero Section */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
        padding: '100px 20px', 
        textAlign: 'center',
        color: colors.white,
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '700', 
            margin: '0 0 25px 0',
            letterSpacing: '-0.5px'
          }}>
            Welcome to Labour NET
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            margin: '0 0 50px 0',
            opacity: 0.9,
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Connecting skilled professionals with exceptional opportunities. Find your next career move or hire the perfect candidate for your organization.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              background: colors.success,
              color: colors.white,
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#2f855a';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = colors.success;
              e.target.style.transform = 'translateY(0)';
            }}>
              Join as Professional
            </Link>
            <Link to="/register" style={{
              background: 'transparent',
              color: colors.white,
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              border: `2px solid ${colors.white}`
            }}
            onMouseEnter={(e) => {
              e.target.style.background = colors.white;
              e.target.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = colors.white;
            }}>
              Hire Professionals
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 20px', background: colors.light }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '60px',
            color: colors.dark,
            fontWeight: '700'
          }}>
            Why Choose Labour NET?
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '40px' 
          }}>
            {/* Feature 1 */}
            <div style={{ 
              background: colors.white, 
              padding: '40px', 
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                borderRadius: '50%',
                margin: '0 auto 25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.white,
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                S
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '15px',
                color: colors.dark,
                fontWeight: '600'
              }}>
                Smart Job Discovery
              </h3>
              <p style={{ 
                color: colors.gray, 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Advanced filtering and matching algorithms help you find the perfect opportunities based on your skills, experience, and preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ 
              background: colors.white, 
              padding: '40px', 
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${colors.success} 0%, #4ade80 100%)`,
                borderRadius: '50%',
                margin: '0 auto 25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.white,
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                E
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '15px',
                color: colors.dark,
                fontWeight: '600'
              }}>
                Efficient Application Process
              </h3>
              <p style={{ 
                color: colors.gray, 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Streamlined application system with real-time tracking and instant notifications. Apply to multiple positions with just a few clicks.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ 
              background: colors.white, 
              padding: '40px', 
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${colors.accent} 0%, #63b3ed 100%)`,
                borderRadius: '50%',
                margin: '0 auto 25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.white,
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                P
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '15px',
                color: colors.dark,
                fontWeight: '600'
              }}>
                Professional Matching
              </h3>
              <p style={{ 
                color: colors.gray, 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                AI-powered matching system that connects qualified professionals with the right opportunities for optimal career growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Categories Section */}
      <div style={{ 
        background: colors.white, 
        padding: '80px 20px',
        borderTop: '1px solid colors.lightGray'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '60px',
            color: colors.dark,
            fontWeight: '700'
          }}>
            Professional Service Categories
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '25px' 
          }}>
            {[
              { name: 'Plumbing', color: colors.primary, bg: '#ebf8ff' },
              { name: 'Cooking', color: '#d69e2e', bg: '#fffbeb' },
              { name: 'Painting', color: '#805ad5', bg: '#faf5ff' },
              { name: 'Electrical', color: '#e53e3e', bg: '#fff5f5' },
              { name: 'Cleaning', color: colors.success, bg: '#f0fff4' }
            ].map((category, index) => (
              <div key={index} style={{ 
                background: category.bg, 
                padding: '30px', 
                borderRadius: '12px',
                textAlign: 'center',
                border: `2px solid ${category.color}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  margin: 0,
                  fontWeight: '600',
                  color: category.color
                }}>
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`, 
        padding: '80px 20px', 
        textAlign: 'center',
        color: colors.white
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 25px 0',
          fontWeight: '700'
        }}>
          Ready to Get Started?
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          margin: '0 0 40px 0',
          opacity: 0.9,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Join thousands of professionals and organizations who trust Labour NET for their hiring and career development needs.
        </p>
        <Link to="/register" style={{
          background: colors.white,
          color: colors.primary,
          padding: '16px 40px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px',
          transition: 'all 0.2s ease',
          display: 'inline-block'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}>
          Get Started Now
        </Link>
      </div>

      {/* Footer */}
      <div style={{ 
        background: colors.dark, 
        padding: '40px 20px', 
        textAlign: 'center',
        color: colors.white
      }}>
        <p style={{ margin: 0, opacity: 0.8 }}>
          © 2024 Labour NET. Connecting professionals with opportunities worldwide.
        </p>
      </div>
    </div>
  );
}
