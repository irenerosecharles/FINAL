
import { User, PropertyRecord, PropertyReport, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'BYTECODE_USERS',
  PROPERTIES: 'BYTECODE_PROPERTIES',
  REPORTS: 'BYTECODE_REPORTS',
  CURRENT_USER: 'BYTECODE_ACTIVE_SESSION'
};

const logSql = (query: string) => {
  if ((window as any).logSql) (window as any).logSql(query);
};

export const PropertyStorage = {
  // --- AUTHENTICATION ---
  signup: (userData: Omit<User, 'id'>): User | null => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    // Check if email already exists
    if (users.find((u: User) => u.email === userData.email)) {
      alert("Email already registered in Snowflake Identity Provider.");
      return null;
    }

    const newUser = { 
      ...userData, 
      id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}` 
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    logSql(`INSERT INTO SNOWFLAKE.IDENTITY.USERS (ID, EMAIL, ROLE, FULL_NAME) VALUES ('${newUser.id}', '${newUser.email}', '${newUser.role}', '${newUser.fullName}')`);
    return newUser;
  },

  login: (email: string, password?: string): User | null => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPass } = user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPass));
      logSql(`SELECT ID, ROLE FROM SNOWFLAKE.IDENTITY.USERS WHERE EMAIL = '${email}' AND PASSWORD_HASH = SHA256('${password}')`);
      return userWithoutPass as User;
    }
    logSql(`SELECT 0 FROM SNOWFLAKE.IDENTITY.USERS WHERE EMAIL = '${email}' -- FAILED AUTH`);
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    logSql(`REVOKE SESSION TOKEN FROM SNOWFLAKE.IDENTITY.USERS`);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  // --- PROPERTIES ---
  registerProperty: (prop: Omit<PropertyRecord, 'id' | 'registeredDate'>): PropertyRecord => {
    const properties = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    const newProp = { 
      ...prop, 
      id: `PROP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      registeredDate: new Date().toLocaleDateString() 
    };
    properties.push(newProp);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    
    logSql(`INSERT INTO SNOWFLAKE.LEDGER.PROPERTIES (ID, HOUSE_NUMBER, ADDRESS, OWNER_ID) VALUES ('${newProp.id}', '${newProp.houseNumber}', '${newProp.address}', '${newProp.ownerId}')`);
    return newProp;
  },

  getAllProperties: (): PropertyRecord[] => {
    logSql(`SELECT * FROM SNOWFLAKE.LEDGER.PROPERTIES`);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
  },

  getPropertyByHouseNumber: (num: string): PropertyRecord | null => {
    const props = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    logSql(`SELECT * FROM SNOWFLAKE.LEDGER.PROPERTIES WHERE HOUSE_NUMBER = '${num}' LIMIT 1`);
    return props.find((p: PropertyRecord) => p.houseNumber === num) || null;
  },

  // --- REPORTS ---
  saveReport: (report: PropertyReport): void => {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    reports.push(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    
    // Update property status
    const props = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    const propIndex = props.findIndex((p: PropertyRecord) => p.id === report.propertyId);
    if (propIndex > -1) {
      props[propIndex].status = report.totalRiskScore > 70 ? 'CRITICAL' : report.totalRiskScore > 40 ? 'CONCERN' : 'SAFE';
    }
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(props));

    logSql(`INSERT INTO SNOWFLAKE.LEDGER.REPORTS (ID, PROP_ID, RISK_SCORE) VALUES ('${report.id}', '${report.propertyId}', ${report.totalRiskScore})`);
    logSql(`UPDATE SNOWFLAKE.LEDGER.PROPERTIES SET STATUS = '${props[propIndex]?.status || 'SAFE'}' WHERE ID = '${report.propertyId}'`);
  },

  getReportsByProperty: (propId: string): PropertyReport[] => {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    logSql(`SELECT * FROM SNOWFLAKE.LEDGER.REPORTS WHERE PROP_ID = '${propId}' ORDER BY DATE DESC`);
    return reports.filter((r: PropertyReport) => r.propertyId === propId);
  }
};
