package ComicsFetch::viiviwagner;
use 5.030;
use strict;
use warnings;

sub get() {
    ::get_comic(
        'https://www.hs.fi/viivijawagner/',
 	    'viiviwagner',
        30,
        sub {
            my($tree) = @_;
            my $url;

            my $node = $tree->look_down(class => 'cartoon-content');
            if ($node) {
                my $figure = $node->find('figure');
                if ($figure) {
                    my $img = $figure->find('img');
                    if ($img) {
                        my $src = $img->attr('data-srcset');
                        ($url = (split(' ', $src))[0]) =~ s,^//,https://,
                            if $src;
                    }
                }
            }

            return($url ? $url : ());
        }
    );
}

1;
