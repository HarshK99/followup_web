'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tokens } from '../../design-system/tokens';
import { Button, Text } from '../../design-system/components';

const SIDEBAR_STORAGE_KEY = 'manager.sidebarCollapsed';
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const raw = sessionStorage.getItem(SIDEBAR_STORAGE_KEY);
      return raw === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch (e) {
      // ignore storage errors
    }
  }, [collapsed]);

  const navItems = [
    { href: '/manager', label: 'Dashboard', icon: '🏠' },
    { href: '/manager/followups', label: 'Follow-ups', icon: '🔁' },
    { href: '/manager/visit-events', label: 'Visits', icon: '📅' },
  ];

  const sidebarOuterStyle: React.CSSProperties = {
    width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
    transition: 'width 160ms ease',
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacing[3],
    boxSizing: 'border-box',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing[3],
    padding: `${tokens.spacing[2]}px ${tokens.spacing[2]}px`,
  };

  const navStyle: React.CSSProperties = {
    marginTop: tokens.spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing[2],
  };

  const itemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing[3],
    padding: `${tokens.spacing[2]}px ${tokens.spacing[2]}px`,
    borderRadius: tokens.borderRadius.sm,
    textDecoration: 'none',
    color: active ? tokens.colors.primary : tokens.colors.textPrimary,
    backgroundColor: active ? tokens.colors.primaryLight : 'transparent',
  });

  const iconOnlyStyle: React.CSSProperties = {
    width: 32,
    textAlign: 'center',
    fontSize: 18,
  };

  return (
    <div style={sidebarOuterStyle}>
      <div style={logoStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
          <div style={{ fontSize: 20 }}>{/* placeholder logo */}📎</div>
          {!collapsed && <Text size="md" weight="bold">FollowUpX</Text>}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '›' : '‹'}
          </Button>
        </div>
      </div>

      <nav style={navStyle} aria-label="Manager navigation">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} style={itemStyle(active)}>
              <div style={iconOnlyStyle}>{item.icon}</div>
              {!collapsed && <div>{item.label}</div>}
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{ padding: tokens.spacing[2] }}>
        {!collapsed && <Text size="sm">Manager • Desktop</Text>}
      </div>
    </div>
  );
}
