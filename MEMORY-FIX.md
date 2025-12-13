# Memory Optimization Instructions

## Immediate Actions Required:

### 1. **Reload VS Code Window**
   - Press `Ctrl+Shift+P`
   - Type "Developer: Reload Window"
   - Press Enter

### 2. **Close Unused Editors**
   - Press `Ctrl+K`, then `W` to close all editors
   - Or: `Ctrl+Shift+P` → "Close All Editors"

### 3. **Disable Extensions Temporarily**
   - Press `Ctrl+Shift+X` to open Extensions
   - Disable these if installed:
     - Local History
     - GitLens (if installed)
     - Auto Import/Path Intellisense
     - Any AI assistants
     - Prettier (use on-demand instead)

### 4. **Monitor Memory Usage**
   Open Task Manager (Ctrl+Shift+Esc) and check:
   - **Code.exe** processes - Should be < 500MB each
   - **Node.exe** - Should be < 2GB total
   - If any process > 2GB, restart VS Code

### 5. **VS Code Settings Applied**
   ✅ Reduced TypeScript memory: 4GB → 2GB
   ✅ Disabled Git integration
   ✅ Disabled minimap, breadcrumbs, semantic highlighting
   ✅ Disabled auto-save
   ✅ Disabled telemetry

### 6. **If Still Crashing**
   ```powershell
   # Option A: Use lighter text editor temporarily
   notepad app\config\api.ts
   
   # Option B: Increase VS Code memory limit
   code --max-memory=4096
   
   # Option C: Use VS Code Insiders (lighter)
   # Download from: https://code.visualstudio.com/insiders/
   ```

### 7. **Long-term Solution**
   - Add more RAM to your system (recommended: 16GB minimum)
   - Use VS Code Remote Development (WSL2)
   - Split project into smaller workspaces
   - Use lighter editor like VS Code Web

## Current Memory Allocations:
- Node.js: 8GB (package.json)
- TypeScript Server: 2GB (.vscode/settings.json)
- VS Code: Default (~1GB per window)

**Total Expected: ~11GB** - If your system has less RAM, VS Code will crash.

## Quick Memory Check:
Press `Win+R`, type `msinfo32`, check "Total Physical Memory"
- < 8GB: High risk of crashes
- 8-12GB: Moderate risk
- > 16GB: Should be stable
