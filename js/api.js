// API Service for Frontend-Backend Connection
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
    }

    // Home Updates API
    async getHomeUpdates() {
        try {
            const response = await fetch(`${this.baseURL}/home-updates`);
            if (!response.ok) throw new Error('Failed to fetch home updates');
            return await response.json();
        } catch (error) {
            console.error('Error fetching home updates:', error);
            return [];
        }
    }

    async createHomeUpdate(updateData, imageFile) {
        try {
            const formData = new FormData();
            
            // Add text fields
            Object.keys(updateData).forEach(key => {
                formData.append(key, updateData[key]);
            });
            
            // Add image file if provided
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            const response = await fetch(`${this.baseURL}/home-updates`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Failed to create home update');
            return await response.json();
        } catch (error) {
            console.error('Error creating home update:', error);
            throw error;
        }
    }

    // Members API
    async getMembers(filters = {}) {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await fetch(`${this.baseURL}/members?${queryString}`);
            if (!response.ok) throw new Error('Failed to fetch members');
            return await response.json();
        } catch (error) {
            console.error('Error fetching members:', error);
            return [];
        }
    }

    async createMember(memberData) {
        try {
            const response = await fetch(`${this.baseURL}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memberData)
            });
            
            if (!response.ok) throw new Error('Failed to create member');
            return await response.json();
        } catch (error) {
            console.error('Error creating member:', error);
            throw error;
        }
    }

    async updateMember(memberId, memberData) {
        try {
            const response = await fetch(`${this.baseURL}/members/${memberId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memberData)
            });
            
            if (!response.ok) throw new Error('Failed to update member');
            return await response.json();
        } catch (error) {
            console.error('Error updating member:', error);
            throw error;
        }
    }

    async deleteMember(memberId) {
        try {
            const response = await fetch(`${this.baseURL}/members/${memberId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete member');
            return await response.json();
        } catch (error) {
            console.error('Error deleting member:', error);
            throw error;
        }
    }

    // Attendance API
    async getAttendance(filters = {}) {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await fetch(`${this.baseURL}/attendance?${queryString}`);
            if (!response.ok) throw new Error('Failed to fetch attendance');
            return await response.json();
        } catch (error) {
            console.error('Error fetching attendance:', error);
            return [];
        }
    }

    async saveAttendance(attendanceData) {
        try {
            const response = await fetch(`${this.baseURL}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(attendanceData)
            });
            
            if (!response.ok) throw new Error('Failed to save attendance');
            return await response.json();
        } catch (error) {
            console.error('Error saving attendance:', error);
            throw error;
        }
    }

    // Image Upload API
    async uploadImage(imageFile) {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Failed to upload image');
            return await response.json();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}

// Export for use in frontend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
} else {
    window.ApiService = ApiService;
}
