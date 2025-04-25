
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface ProfileData {
  username: string | null;
  full_name: string | null;
  bio: string | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    full_name: '',
    bio: ''
  });

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
      fetchProfileData(session.user.id);
    });
  }, [navigate]);

  const fetchProfileData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, bio')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Code for no rows returned
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile data');
        }
      }

      if (data) {
        setProfileData({
          username: data.username,
          full_name: data.full_name,
          bio: data.bio
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setSaving(true);
    try {
      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      let error;
      
      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: profileData.username,
            full_name: profileData.full_name,
            bio: profileData.bio,
            updated_at: new Date().toISOString()
          });
          
        error = insertError;
      } else {
        // Update profile if it exists
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: profileData.username,
            full_name: profileData.full_name,
            bio: profileData.bio,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        error = updateError;
      }

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input
                  id="username"
                  name="username"
                  value={profileData.username || ''}
                  onChange={handleChange}
                  placeholder="Your username"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profileData.full_name || ''}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                <Input
                  id="bio"
                  name="bio"
                  value={profileData.bio || ''}
                  onChange={handleChange}
                  placeholder="A short bio about yourself"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
