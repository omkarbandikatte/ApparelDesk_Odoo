import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address_city: '',
    address_state: '',
    address_pincode: '',
    role: 'portal', // 'portal' (customer) or 'internal' (admin)
  });
  // console.log(formData);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData({ ...formData, role: newRole });
    setShowAdminCode(newRole === 'internal');
    setAdminCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Admin code validation
    if (formData.role === 'internal' && adminCode !== 'ADMIN2025') { // Change this code in backend too
      setError('Invalid admin code. Contact administrator for access.');
      setLoading(false);
      return;
    }

    // Split address into city/state/pincode for backend
    const submitData = {
      ...formData,
      // Map frontend to backend
    };

    const result = await signup(submitData);
    setLoading(false);
    console.log(submitData)
    if (result.success) {
      if (submitData.role === 'internal') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground">Choose your account type and get started</p>
        </div>

        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password *
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mobile" className="text-sm font-medium leading-none">
                  Mobile
                </label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              {/* Split address into city/state/pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="address_city" className="text-sm font-medium leading-none">
                    City
                  </label>
                  <Input
                    id="address_city"
                    name="address_city"
                    type="text"
                    placeholder="Mumbai"
                    value={formData.address_city}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address_state" className="text-sm font-medium leading-none">
                    State
                  </label>
                  <Input
                    id="address_state"
                    name="address_state"
                    type="text"
                    placeholder="Maharashtra"
                    value={formData.address_state}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address_pincode" className="text-sm font-medium leading-none">
                    Pincode
                  </label>
                  <Input
                    id="address_pincode"
                    name="address_pincode"
                    type="text"
                    placeholder="400001"
                    value={formData.address_pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium leading-none">
                  Account Type *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.role}
                  onChange={handleRoleChange}
                >
                  <option value="portal">Customer (Buy Products)</option>
                  <option value="internal">Internal Admin (Manage System)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  {formData.role === 'portal'
                    ? 'Customer account: Shop and purchase products'
                    : 'Internal Admin: Full system access (requires admin code)'}
                </p>
              </div>

              {/* Admin Code Field - conditionally shown */}
              {showAdminCode && (
                <div className="space-y-2">
                  <label htmlFor="adminCode" className="text-sm font-medium leading-none">
                    Admin Access Code *
                  </label>
                  <Input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    placeholder="Enter admin code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact your administrator for the access code
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </Card>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
