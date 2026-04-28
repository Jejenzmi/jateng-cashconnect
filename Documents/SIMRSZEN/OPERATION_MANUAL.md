# Operation Manual - SIMRS ZEN

## System Overview

SIMRS ZEN adalah sistem informasi manajemen rumah sakit modern yang dibangun dengan teknologi Node.js, TypeScript, dan PostgreSQL. Sistem ini mencakup semua modul penting dalam operasional rumah sakit.

## Operational Procedures

### 1. Daily Operations

#### 1.1. System Startup
1. Start PostgreSQL database:
   ```bash
   sudo systemctl start postgresql
   ```

2. Start Redis cache:
   ```bash
   sudo systemctl start redis
   ```

3. Start backend application:
   ```bash
   cd /path/to/simrszen/backend
   pm2 start simrszen-backend
   ```

4. Verify all services are running:
   ```bash
   pm2 status
   ```

#### 1.2. System Monitoring
- Check application status: `pm2 status`
- Monitor logs: `pm2 logs simrszen-backend --lines 100`
- Check system resources: `htop`
- Verify database connectivity: `pg_isready`
- Check disk space: `df -h`

#### 1.3. Backup Verification
- Verify daily backup completion: `ls -la /backups/simrszen/ | head -10`
- Check backup file integrity (random sample)
- Verify backup retention policy is working

### 2. Maintenance Tasks

#### 2.1. Weekly Maintenance
1. Update dependencies:
   ```bash
   cd /path/to/simrszen/backend
   npm outdated
   npm update
   ```

2. Database maintenance:
   ```sql
   -- Connect to database
   \c simrszen
   
   -- Analyze and vacuum
   VACUUM ANALYZE;
   
   -- Update statistics
   ANALYZE;
   ```

3. Clean old logs:
   ```bash
   find /path/to/simrszen/backend/logs -name "*.log" -mtime +7 -delete
   ```

#### 2.2. Monthly Maintenance
1. Performance review:
   - Analyze slow queries
   - Review system resource usage
   - Optimize database indexes if needed

2. Security audit:
   - Review access logs for suspicious activity
   - Verify SSL certificates are valid
   - Check for security updates

3. Data integrity checks:
   - Validate foreign key constraints
   - Check for orphaned records
   - Verify backup restoration process

### 3. Troubleshooting Guide

#### 3.1. Common Issues

**Issue**: Application fails to start
- **Cause**: Missing environment variables or database connection issues
- **Solution**: 
  1. Verify all environment variables are set
  2. Check database connectivity
  3. Review logs for specific error messages

**Issue**: Slow API response times
- **Cause**: Database performance issues or high load
- **Solution**:
  1. Check database query performance
  2. Review system resources (CPU, RAM, Disk I/O)
  3. Consider adding database indexes
  4. Scale application instances if needed

**Issue**: Users unable to login
- **Cause**: Authentication service down or JWT configuration issues
- **Solution**:
  1. Verify JWT secret is correctly configured
  2. Check if authentication service is running
  3. Review user account status in the database

#### 3.2. Error Resolution Steps

1. Identify the error in logs
2. Reproduce the issue if possible
3. Check system resources
4. Verify external dependencies (database, cache, etc.)
5. Apply appropriate solution
6. Test resolution
7. Document the incident

### 4. Security Procedures

#### 4.1. Access Control
- Regularly review user accounts and permissions
- Disable accounts of former employees immediately
- Implement multi-factor authentication for administrative access
- Limit SSH access to authorized IPs only

#### 4.2. Audit Trail
- Regularly review audit logs for suspicious activity
- Monitor failed login attempts
- Track changes to sensitive data
- Generate monthly security reports

#### 4.3. Incident Response
1. Containment: Isolate affected systems
2. Eradication: Remove threat source
3. Recovery: Restore systems to normal operation
4. Lessons Learned: Document incident and improve procedures

### 5. Performance Tuning

#### 5.1. Database Optimization
- Add indexes to frequently queried columns
- Analyze and optimize slow queries
- Implement partitioning for large tables
- Configure connection pooling

#### 5.2. Application Caching
- Implement Redis for session storage
- Cache frequently accessed data
- Configure CDN for static assets
- Implement HTTP caching headers

#### 5.3. Load Balancing
- Deploy multiple application instances
- Configure Nginx for load balancing
- Monitor instance health
- Implement auto-scaling based on load

### 6. Disaster Recovery

#### 6.1. Backup Restoration Process
1. Stop the application: `pm2 stop simrszen-backend`
2. Restore database from backup:
   ```bash
   psql -U username -d simrszen -f /path/to/backup.sql
   ```
3. Restore configuration files if needed
4. Start the application: `pm2 start simrszen-backend`
5. Verify functionality

#### 6.2. System Recovery Checklist
- [ ] Verify backup integrity before restoration
- [ ] Test restoration process regularly
- [ ] Document recovery procedures
- [ ] Train staff on recovery procedures
- [ ] Maintain offline copies of critical configurations

### 7. Reporting and Analytics

#### 7.1. Daily Reports
- System uptime and availability
- Database performance metrics
- Error rate and exception logs
- User activity summary

#### 7.2. Weekly Reports
- Performance trends
- Resource utilization
- Security incidents
- Feature usage analytics

#### 7.3. Monthly Reports
- System reliability metrics
- Capacity planning analysis
- Security audit results
- User satisfaction feedback

### 8. Change Management

#### 8.1. Update Procedure
1. Create backup before any changes
2. Test changes in staging environment
3. Schedule maintenance window
4. Notify users of planned downtime
5. Deploy changes
6. Verify functionality
7. Monitor for issues
8. Document changes

#### 8.2. Rollback Plan
1. Maintain previous version of application
2. Document rollback procedures
3. Test rollback process regularly
4. Keep database migration rollback scripts ready
5. Have support team available during rollbacks